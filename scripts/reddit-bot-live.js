const { chromium } = require("playwright");
const ANSWERS = {
  tax: "You are self-employed - file Schedule C. Budget 25-30% of net for taxes. Track everything: equipment, software, internet, platform fees - all deductible. I built Staxx (staxx.site) - upload an OF dashboard screenshot, AI categorizes everything. Free trial.",
  deduction: "Write-offs most creators miss: Camera gear, editing software, internet & phone, home studio, props, OF 20% fees, health insurance. Staxx (staxx.site) has a 12-point creator write-off checklist. Free.",
  quarterly: "Quarterly estimated tax: Apr 15 / Jun 15 / Sep 15 / Jan 15. Pay 30% of net profit. Staxx (staxx.site) auto-calculates your quarterly estimate. Free trial."
};

(async () => {
  const browser = await chromium.launch({ headless: false, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  // Go to search
  await page.goto("https://www.reddit.com/r/onlyfansadvice/search/?q=tax&sort=new&restrict_sr=on&t=week", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const links = await page.evaluate(() => {
    return [...document.querySelectorAll("a[data-testid=post-title]")].slice(0, 5).map(e => e.href);
  });
  
  console.log(`Found ${links.length} posts\n`);
  
  let posted = 0;
  for (const link of links) {
    if (posted >= 3) break;
    console.log(`${posted + 1}. ${link.slice(0, 70)}`);
    await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(4000);
    
    const title = (await page.title()).toLowerCase();
    let answer = ANSWERS.tax;
    if (title.includes("deduction") || title.includes("write")) answer = ANSWERS.deduction;
    else if (title.includes("quarterly")) answer = ANSWERS.quarterly;
    
    try {
      // Click the main comment box
      const clickResult = await page.evaluate(() => {
        const el = document.querySelector("faceplate-textarea-input");
        if (el) { el.click(); return "clicked"; }
        // Try fallback: click any element that looks like a comment box
        const alt = document.querySelector("[slot=comment]");
        if (alt) { alt.click(); return "slot-clicked"; }
        return "not-found";
      });
      console.log(`   Comment box: ${clickResult}`);
      
      if (clickResult !== "not-found") {
        await page.waitForTimeout(1500);
        
        // Type the comment using keyboard (works regardless of shadow DOM)
        await page.keyboard.type(answer, { delay: 15 });
        await page.waitForTimeout(500);
        
        // Submit with Cmd+Enter (Mac) or Ctrl+Enter
        const isMac = process.platform === "darwin";
        if (isMac) {
          await page.keyboard.press("Meta+Enter");
        } else {
          await page.keyboard.press("Control+Enter");
        }
        console.log("   Submitted!");
        posted++;
        await page.waitForTimeout(3000);
      }
    } catch(e) {
      console.log(`   Error: ${e.message.slice(0, 60)}`);
    }
  }
  
  console.log(`\nDone! Posted ${posted} replies.`);
  await browser.close();
})();
