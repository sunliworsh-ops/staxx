import Link from "next/link";

export const metadata = {
  title: "OnlyFans Tax Guide 2026 — How to File Taxes as a Content Creator",
  description: "Complete tax guide for OnlyFans creators: self-employment tax, quarterly estimates, write-offs, 1099 forms, and how to stay audit-proof in 2026.",
};

export default function Article() {
  return (
    <div className="min-h-screen bg-staxx-warm-bg py-12 px-4">
      <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed text-staxx-indigo">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs rounded-full bg-staxx-purple/10 text-staxx-purple px-2 py-0.5">taxes</span>
            <span className="text-xs rounded-full bg-staxx-purple/10 text-staxx-purple px-2 py-0.5">beginners</span>
          </div>
          <h1 className="text-3xl font-bold font-display">How to File Taxes as an OnlyFans Creator (2026 Guide)</h1>
          <p className="text-muted-foreground text-xs">June 15, 2026 · 8 min read</p>
        </div>

        <p>If you made money on OnlyFans, Patreon, Fansly, or any creator platform this year — the IRS considers you <strong>self-employed</strong>. That means you're responsible for paying your own taxes. No employer is withholding anything for you. And if you don't plan for it, tax season can be brutal.</p>
        <p>This guide covers everything you need to know: what forms you'll get, how to calculate what you owe, which deductions actually save you money, and how to set yourself up so April doesn't destroy your bank account.</p>

        <h2 className="text-xl font-semibold pt-4">Are You Self-Employed or a Hobbyist?</h2>
        <p>The IRS cares about one thing: <strong>are you trying to make a profit?</strong> If you treat OnlyFans like a business — consistent posting, promoting, tracking expenses — you're self-employed. If you post occasionally and don't promote, the IRS might call it a hobby.</p>
        <p><strong>Why it matters:</strong> Hobby income is taxed at your full rate with NO deductions. Self-employment income lets you deduct expenses, which can save you thousands. If you made more than $400, you're almost certainly self-employed and must file.</p>

        <h2 className="text-xl font-semibold pt-4">What Tax Forms Will You Get?</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>1099-NEC:</strong> OnlyFans sends this if you earn over $600 in a year. Shows your gross earnings before their 20% cut.</li>
          <li><strong>1099-K:</strong> For payment processors — applies if you receive payments through a third-party platform. Thresholds vary by state.</li>
          <li><strong>Schedule C (Form 1040):</strong> This is the form YOU fill out. Where you report income AND deduct expenses. This is the one that determines how much tax you actually pay.</li>
          <li><strong>Schedule SE:</strong> Calculates your self-employment tax (Social Security + Medicare = 15.3%).</li>
        </ul>

        <h2 className="text-xl font-semibold pt-4">Self-Employment Tax: The 15.3% You Didn't Know About</h2>
        <p>This is the biggest shock for new creators. As a W-2 employee, your employer pays half of your Social Security and Medicare taxes. As self-employed, <strong>you pay both halves — 15.3% on your first $176,100 of net income</strong> (2026 limit).</p>
        <p>Example: You net $60,000 after deductions. Your SE tax = $60,000 × 92.35% × 15.3% = roughly $8,479. On top of regular income tax.</p>
        <p><strong>But here's the good news:</strong> You can deduct half of your SE tax from your taxable income. And business deductions reduce the net income that SE tax applies to. Every dollar you write off saves you ~15-30 cents in taxes.</p>

        <h2 className="text-xl font-semibold pt-4">Quarterly Estimated Tax: Don't Wait Until April</h2>
        <p>The IRS runs on a pay-as-you-go system. If you expect to owe more than $1,000 in taxes for the year, you need to make quarterly estimated payments:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Q1 (Jan-Mar):</strong> Due April 15</li>
          <li><strong>Q2 (Apr-May):</strong> Due June 15</li>
          <li><strong>Q3 (Jun-Aug):</strong> Due September 15</li>
          <li><strong>Q4 (Sep-Dec):</strong> Due January 15 (next year)</li>
        </ul>
        <p>Skip these payments and the IRS charges penalties — currently around 8% annual interest. For someone who owes $8,000 in taxes, missing two quarters could add ~$200 in penalties.</p>

        <h2 className="text-xl font-semibold pt-4">The Deductions That Actually Save You Money</h2>
        <p>As a content creator, almost anything you use to produce content is potentially deductible. The key categories:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Equipment:</strong> Cameras, ring lights, microphones, tripods, SD cards</li>
          <li><strong>Software:</strong> Adobe Creative Cloud, Canva Pro, editing apps</li>
          <li><strong>Internet & Phone:</strong> The percentage used for business (be reasonable — claiming 100% on audit is a red flag)</li>
          <li><strong>Home Office:</strong> If you have a dedicated space used exclusively for content creation</li>
          <li><strong>Props, Wardrobe, Makeup:</strong> Items used specifically for content (not your everyday clothes)</li>
          <li><strong>Promotion & Advertising:</strong> Social media ads, shoutouts, Twitter promotion</li>
          <li><strong>Platform Fees:</strong> OnlyFans' 20% cut, Patreon's 5-12%, payment processing fees</li>
          <li><strong>Health Insurance:</strong> Premiums for yourself and dependents</li>
          <li><strong>Retirement Contributions:</strong> SEP IRA or Solo 401(k) — contribute up to $66,000/year pre-tax</li>
          <li><strong>Tax Prep & CPA Fees:</strong> The cost of filing is deductible</li>
        </ul>

        <h2 className="text-xl font-semibold pt-4">How to Stay Audit-Proof</h2>
        <p>Content creators don't get audited more than anyone else. But certain things trigger IRS attention:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Claiming 100% of your rent as a home office deduction</li>
          <li>Reporting way less income than your 1099s show</li>
          <li>Deducting "wardrobe" that's really just your everyday clothes</li>
          <li>Large round-number deductions without receipts</li>
        </ul>
        <p><strong>The golden rule:</strong> If you couldn't explain it to an IRS agent with a straight face, don't deduct it. And keep receipts. Always.</p>

        <h2 className="text-xl font-semibold pt-4">The Easy Way: Let AI Handle the Math</h2>
        <p>You didn't become a creator to do bookkeeping. That's why we built <strong>Staxx</strong> — a financial tracker specifically for OnlyFans and Patreon creators.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Upload a screenshot of your earnings dashboard → <strong>AI auto-categorizes everything</strong></li>
          <li>See your real profit after platform fees and expenses in real time</li>
          <li>Get quarterly estimated tax amounts so you know exactly what to save</li>
          <li>Download a Schedule C-ready report for your CPA or TurboTax</li>
          <li>Track 12 categories of creator-specific write-offs you might be missing</li>
        </ul>

        <div className="rounded-2xl bg-staxx-purple/5 border border-staxx-purple/20 p-6 text-center space-y-3">
          <p className="font-semibold text-staxx-indigo">Try Staxx free for 7 days. No credit card. No real name needed.</p>
          <Link href="/signup" className="btn-staxx inline-flex h-10 px-6 text-sm">Start Free</Link>
        </div>

        <div className="text-xs text-muted-foreground pt-4 border-t">
          <strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute tax advice. Everyone's situation is different. Always consult a licensed CPA or tax professional before filing.
        </div>
      </article>
    </div>
  );
}
