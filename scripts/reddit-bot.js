// Staxx Reddit Bot — auto-post helpful answers to tax questions
const { chromium } = require("playwright");

const ANSWERS = {
  tax: `Here's what you need to know about OF and taxes:

You're self-employed → file Schedule C. Budget ~25-30% of net profit for taxes (income tax + 15.3% SE tax). Track EVERYTHING — equipment, software, internet, platform fees, home office — all deductible. Most creators miss $3-5K/year.

I built Staxx (staxx.site) for exactly this — upload an OF dashboard screenshot and AI auto-categorizes everything, shows your estimated quarterly tax. 7-day free trial.`,
  deduction: `Write-offs most OF creators miss:
📸 Cameras, ring lights, tripods | 💻 Editing software (Adobe, CapCut) | 📱 Internet & phone (% business use) | 🏠 Home studio space | 👗 Props & wardrobe (content-specific) | 💸 OF 20% platform fee | 🏥 Health insurance | 💰 SEP IRA contributions

Keep receipts. Rule: if you use it to create content, it's probably deductible.

Staxx (staxx.site) has a 12-point write-off checklist built for OF/Patreon creators — shows what you're capturing and what you're missing. Free.`,
  quarterly: `Quick guide to quarterly estimated tax:
Due: Apr 15 / Jun 15 / Sep 15 / Jan 15
How much: quarterly net profit × ~30%
Required if: you'll owe >$1,000 this year
Penalty for missing: ~8% annual interest

Set aside 30% of every payout in a separate savings account.

I built Staxx (staxx.site) to auto-calculate your quarterly estimate from actual OF/Patreon data. Free trial — no card needed.`
};

const SEARCHES = [
  { sub: "onlyfansadvice", term: "tax" }, { sub: "onlyfansadvice", term: "write off" },
  { sub: "creatorsadvice", term: "tax" }, { sub: "tax", term: "onlyfans" },
];

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("🌐 Opening Reddit...");
  await page.goto("https://www.reddit.com/login");
  console.log("⏳ Log in to Reddit in the browser, then press Enter here...");
  await new Promise(r => process.stdin.once("data", r));

  for (const s of SEARCHES) {
    try {
      const url = `https://www.reddit.com/r/${s.sub}/search/?q=${s.term}&sort=new&restrict_sr=on&t=week`;
      console.log(`🔍 r/${s.sub} — "${s.term}"`);
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

      const links = await page.$$eval('a[data-testid="post-title"]', els => els.slice(0, 2).map(e => e.href));

      for (const link of links) {
        console.log(`  📝 ${link.slice(0, 80)}...`);
        await page.goto(link, { waitUntil: "networkidle", timeout: 15000 });

        const title = (await page.title()).toLowerCase();
        let answer = ANSWERS.tax;
        if (title.includes("deduction") || title.includes("write")) answer = ANSWERS.deduction;
        else if (title.includes("quarterly") || title.includes("estimated")) answer = ANSWERS.quarterly;

        try {
          const replyBtn = page.locator('button[aria-label="Reply"], button:has-text("Reply")').first();
          if (await replyBtn.isVisible({ timeout: 2000 })) {
            await replyBtn.click();
            await page.waitForTimeout(500);
            const editor = page.locator('[contenteditable="true"], textarea').first();
            await editor.fill(answer);
            await page.waitForTimeout(300);
            await page.locator('button[type="submit"], button:has-text("Comment")').first().click();
            console.log(`  ✅ Posted!`);
            await page.waitForTimeout(2000);
          }
        } catch(e) {
          console.log(`  ⚠️ ${e.message.slice(0, 60)}`);
        }
      }
    } catch(e) {
      console.log(`  ❌ ${e.message.slice(0, 60)}`);
    }
  }

  console.log("\nDone! Press Enter to close...");
  await new Promise(r => process.stdin.once("data", r));
  await browser.close();
}

main();
