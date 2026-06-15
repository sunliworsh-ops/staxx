// Staxx Reddit Helper — find tax posts + generate answers for manual posting
// Run: open these URLs in your browser, copy-paste the answers

const POSTS = [];

async function findPosts() {
  const searchUrls = [
    "https://www.reddit.com/r/onlyfansadvice/search/?q=tax&sort=new&restrict_sr=on&t=week",
    "https://www.reddit.com/r/creatorsadvice/search/?q=tax&sort=new&restrict_sr=on&t=week",
    "https://www.reddit.com/r/tax/search/?q=onlyfans&sort=new&restrict_sr=on&t=month",
  ];

  console.log("🔗 Open these URLs in your browser:\n");
  searchUrls.forEach(url => console.log("  " + url));
  console.log("\n📋 For each post about creator taxes, use one of these answers:\n");
}

findPosts();

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("ANSWER A — Tax basics:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`You're self-employed → file Schedule C. Budget 25-30% of net for taxes (income tax + 15.3% SE tax).

Track everything: equipment, software, internet, home office, platform fees — all deductible. Most creators miss $3-5K/year in write-offs.

I built Staxx (staxx.site) to handle this — upload an OF dashboard screenshot, AI categorizes everything, shows estimated quarterly tax. 7-day free trial, no card.`);

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("ANSWER B — Write-offs / Deductions:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Write-offs creators miss:
📸 Gear (cameras, lights, mics) | 💻 Software (Adobe, CapCut) | 📱 Internet & phone | 🏠 Home studio | 👗 Props & wardrobe | 📢 Promotion | 💸 Platform fees | 🏥 Health insurance | 💰 SEP IRA

Keep receipts. IRS rule: "ordinary and necessary" for your business.

Staxx (staxx.site) has a 12-point write-off checklist built for creators. Shows what you're capturing and what you're missing. Free.`);

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("ANSWER C — Quarterly estimated tax:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Due dates: Apr 15 / Jun 15 / Sep 15 / Jan 15
Pay if you'll owe >$1,000 for the year
Set aside ~30% of each payout

Missing = penalty ~8% APR

I built Staxx (staxx.site) to auto-calculate your quarterly estimate from actual income. Free trial.`);

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("⚡ PRO TIP: Reddit hates copy-paste. Add 1-2 sentences");
console.log("   relevant to the specific question before the template.");
console.log("   Customize 'I built Staxx' → 'I use Staxx for...' if needed.");
