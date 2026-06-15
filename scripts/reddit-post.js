// Post answers to Reddit using already-logged-in Playwright browser
const { chromium } = require("playwright");

const ANSWERS = {
  tax: `You're self-employed → file Schedule C. Budget 25-30% of net for taxes (income tax + 15.3% SE tax). Track everything — equipment, software, internet, home office, platform fees — all deductible. Most creators miss $3-5K/year.

I built Staxx (staxx.site) for exactly this — upload an OF dashboard screenshot, AI auto-categorizes everything and gives you estimated quarterly tax. 7-day free trial, no card.`,
  deduction: `Write-offs most creators miss: 📸 Camera gear | 💻 Editing software | 📱 Internet & phone | 🏠 Home studio | 👗 Props & wardrobe | 💸 OF 20% fees | 🏥 Health insurance | 💰 SEP IRA

Keep receipts. IRS rule: "ordinary and necessary" for your business.

Staxx (staxx.site) has a 12-point write-off checklist specifically for OF creators — shows what you're capturing and what you're missing. Free to try.`,
  quarterly: `Quarterly estimated tax deadlines: Apr 15 / Jun 15 / Sep 15 / Jan 15. Pay ~30% of net profit each quarter. Missing a payment = ~8% APR penalty.

I built Staxx (staxx.site) to auto-calculate your quarterly estimate from actual OF/Patreon income — upload a screenshot and it tells you what to save. Free trial.`
};

async function main() {
  // Connect to existing Chrome with remote debugging
  let browser;
  try {
    browser = await chromium.connectOverCDP("http://localhost:9222");
    console.log("Connected to existing Chrome");
  } catch {
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.reddit.com/login");
    console.log("Please log in to Reddit in the browser...");
    await page.waitForURL("**/reddit.com/**", { timeout: 120000 });
  }

  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();

  // Target: r/onlyfansadvice — search tax
  const searches = [
    "https://www.reddit.com/r/onlyfansadvice/search/?q=tax&sort=new&restrict_sr=on&t=week",
    "https://www.reddit.com/r/creatorsadvice/search/?q=tax&sort=new&restrict_sr=on&t=week",
  ];

  for (const url of searches) {
    console.log(`🔍 ${url}`);
    await page.goto(url, { waitUntil: "load", timeout: 30000 });

    const links = await page.$$eval("a[data-testid='post-title']", els => els.slice(0, 2).map(e => e.href));
    for (const link of links) {
      console.log(`  📝 ${link.slice(0, 80)}`);
      await page.goto(link, { waitUntil: "load", timeout: 30000 });

      const title = (await page.title()).toLowerCase();
      let answer = ANSWERS.tax;
      if (title.includes("deduction") || title.includes("write")) answer = ANSWERS.deduction;
      else if (title.includes("quarterly") || title.includes("estimated")) answer = ANSWERS.quarterly;

      try {
        const replyBtn = page.locator('button[aria-label="Reply"], [slot="comment"]').first();
        if (await replyBtn.isVisible({ timeout: 2000 })) {
          await replyBtn.click();
          await page.waitForTimeout(500);
          const editor = page.locator('[contenteditable="true"]').first();
          await editor.fill(answer);
          await page.waitForTimeout(300);
          await page.locator('button[type="submit"]').first().click();
          console.log(`  ✅ Posted!`);
          await page.waitForTimeout(3000);
        }
      } catch(e) {
        console.log(`  ⚠️ ${e.message.slice(0, 50)}`);
      }
    }
  }
  console.log("\nDone!");
  await browser.close();
}

main();
