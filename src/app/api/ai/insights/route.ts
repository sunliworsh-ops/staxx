import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DASHSCOPE_KEY = "sk-58170a8e6ee54c26934bd331b05ee712";

async function generateInsights(userData: {
  income: number; fees: number; profit: number;
  platformBreakdown: Record<string, number>;
  monthlyTrend: Array<{ month: string; income: number }>;
}): Promise<Array<{ category: string; content: string }>> {
  const prompt = `You are a friendly financial assistant for a content creator (OnlyFans/Patreon).

Here is this month's data:
- Total income: $${userData.income.toLocaleString()}
- Platform fees: $${userData.fees.toLocaleString()}
- Net profit: $${userData.profit.toLocaleString()}
- Platform breakdown: ${JSON.stringify(userData.platformBreakdown)}
- Recent monthly trend: ${JSON.stringify(userData.monthlyTrend.slice(-6))}

Generate 2-3 short, actionable insights. Rules:
- Emoji at the start of each insight
- Use casual, friendly tone. "You" and "your"
- Each insight under 150 characters
- Focus on: tax savings opportunities, spending alerts, fee optimization, income trends
- Do NOT give legal/tax advice — phrase as "consider" or "you might"

Return a JSON array:
[{"category": "tax_saving|spending_alert|trend|fee_opt", "content": "insight text here"}]`;

  const res = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DASHSCOPE_KEY}` },
    body: JSON.stringify({ model: "qwen-plus", max_tokens: 500, messages: [{ role: "user", content: prompt }] }),
  });

  if (!res.ok) return [];

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try { return JSON.parse(match[0]); } catch { return []; }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    // Check for existing insights today
    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await supabase
      .from("insights")
      .select("id, category, content, dismissed")
      .eq("user_id", user.id)
      .gte("created_at", today)
      .order("created_at", { ascending: false });

    if (existing && existing.length > 0) {
      return NextResponse.json({ insights: existing });
    }

    // Gather user data for insight generation
    const { data: monthTx } = await supabase.from("transactions").select("amount, platform").eq("user_id", user.id).eq("period", thisMonth);
    const { data: allTx } = await supabase.from("transactions").select("amount, period").eq("user_id", user.id).order("period");

    const income = (monthTx || []).filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const fees = (monthTx || []).filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const platMap: Record<string, number> = {};
    for (const tx of monthTx || []) { const p = tx.platform || "other"; platMap[p] = (platMap[p] || 0) + tx.amount; }

    const monthly: Record<string, { month: string; income: number }> = {};
    for (const tx of allTx || []) {
      const m = tx.period.slice(0, 7);
      if (!monthly[m]) monthly[m] = { month: m, income: 0 };
      if (tx.amount > 0) monthly[m].income += tx.amount;
    }
    const trend = Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));

    // Only generate if user has data
    const newInsights = (monthTx?.length || 0) > 0
      ? await generateInsights({ income, fees, profit: income - fees, platformBreakdown: platMap, monthlyTrend: trend })
      : [];

    // Save to DB
    if (newInsights.length > 0) {
      await supabase.from("insights").insert(
        newInsights.map((i) => ({ user_id: user.id, category: i.category, content: i.content }))
      );
    }

    return NextResponse.json({ insights: newInsights });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
