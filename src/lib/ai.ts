/**
 * AI utility — uses 通义千问 VL (DashScope) for image recognition
 * and text classification of creator platform earnings data.
 */

const API_KEY = process.env.DASHSCOPE_API_KEY!;
const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const MODEL = "qwen3-vl-plus";

interface TransactionResult {
  platform: string;
  category: string;
  amount: number;
  period: string;
  confidence: number;
}

interface AIClassificationResult {
  transactions: TransactionResult[];
  unrecognized: { text: string; amount: number }[];
}

async function callVision(model: string, imageBase64: string, mediaType: string, prompt: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mediaType};base64,${imageBase64}` },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error: ${res.status} — ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function classifyScreenshot(
  imageBase64: string,
  mediaType: string
): Promise<AIClassificationResult> {
  const prompt = `You are analyzing a screenshot from a creator platform (OnlyFans, Patreon, Fansly, etc.) earnings dashboard or payment page.

Extract ALL monetary values visible in the screenshot. For each value found, output a JSON object with this exact structure:

{
  "transactions": [
    {
      "platform": "onlyfans|patreon|fansly|cashapp|venmo|other",
      "category": "subscription|ppv|tip|platform_fee|referral|other_income",
      "amount": 6200.00,
      "period": "2026-06",
      "confidence": 0.95
    }
  ],
  "unrecognized": [
    {"text": "description of what you couldn't classify", "amount": 350.00}
  ]
}

Rules:
- Platform fees are NEGATIVE amounts (e.g., -2490.00 for OF 20% cut)
- "Gross" means before platform cut; "Net" means after platform cut
- If you see both gross and net, use gross and add a separate platform fee entry
- If screenshot shows totals only, estimate fees based on known rates: OF=20%, Patreon=5-12%, Fansly=20%, ManyVids=40%
- Period should be inferred from screenshot context (YYYY-MM format)
- confidence: 0.95 for clearly readable numbers, 0.70 for estimated/partial
- Put anything you cannot confidently classify in unrecognized

Output ONLY the JSON object, no other text.`;

  const raw = await callVision(MODEL, imageBase64, mediaType, prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`AI did not return JSON: ${raw.slice(0, 300)}`);
  const result: AIClassificationResult = JSON.parse(jsonMatch[0]);
  if (!result.transactions || !Array.isArray(result.transactions)) {
    throw new Error("AI response missing transactions array");
  }
  return result;
}

export async function classifyCSV(csvContent: string): Promise<AIClassificationResult> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "qwen-plus",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Analyze this CSV export from a creator platform (OnlyFans, Patreon, etc.) and extract all transactions.

CSV content:
${csvContent.slice(0, 15000)}

Return JSON:
{
  "transactions": [{
    "platform": "onlyfans|patreon|fansly|cashapp|venmo|other",
    "category": "subscription|ppv|tip|platform_fee|referral|other_income",
    "amount": 6200.00,
    "period": "2026-06",
    "confidence": 0.98
  }],
  "unrecognized": []
}
Platform fees = NEGATIVE amounts. Output ONLY the JSON.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error: ${res.status} — ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI did not return JSON");
  return JSON.parse(jsonMatch[0]);
}
