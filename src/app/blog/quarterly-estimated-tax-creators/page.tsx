import Link from "next/link";

export const metadata = {
  title: "Quarterly Estimated Tax for Content Creators 2026 — Deadlines, Calculator & Penalties",
  description: "When and how to pay quarterly estimated taxes as an OnlyFans or Patreon creator. Includes 2026 deadlines, penalty calculator, and how to avoid IRS fines.",
};

export default function Article() {
  return (
    <div className="min-h-screen bg-staxx-warm-bg py-12 px-4">
      <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed text-staxx-indigo">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs rounded-full bg-staxx-purple/10 text-staxx-purple px-2 py-0.5">taxes</span>
            <span className="text-xs rounded-full bg-staxx-purple/10 text-staxx-purple px-2 py-0.5">planning</span>
          </div>
          <h1 className="text-3xl font-bold font-display">Quarterly Estimated Tax for Content Creators: When & How Much to Pay</h1>
          <p className="text-muted-foreground text-xs">June 15, 2026 · 6 min read</p>
        </div>

        <p>The IRS doesn't wait until April to collect. If you're self-employed and expect to owe more than <strong>$1,000</strong> in taxes for the year, you need to make quarterly estimated payments. Miss them and the IRS charges interest — currently around <strong>8% per year</strong>.</p>

        <h2 className="text-xl font-semibold pt-4">2026 Quarterly Tax Deadlines</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b"><th className="py-2 pr-4">Quarter</th><th className="py-2 pr-4">Income Period</th><th className="py-2">Due Date</th></tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2 pr-4">Q1</td><td className="py-2 pr-4">Jan 1 – Mar 31</td><td className="py-2 font-semibold">April 15, 2026</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">Q2</td><td className="py-2 pr-4">Apr 1 – May 31</td><td className="py-2 font-semibold">June 15, 2026</td></tr>
              <tr className="border-b"><td className="py-2 pr-4">Q3</td><td className="py-2 pr-4">Jun 1 – Aug 31</td><td className="py-2 font-semibold">September 15, 2026</td></tr>
              <tr><td className="py-2 pr-4">Q4</td><td className="py-2 pr-4">Sep 1 – Dec 31</td><td className="py-2 font-semibold">January 15, 2027</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold pt-4">Do You Need to Pay Quarterly?</h2>
        <p>You must make estimated payments if <strong>all three</strong> are true:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>You expect to owe at least <strong>$1,000</strong> in federal tax for the year</li>
          <li>Your withholding and refundable credits will be less than the <strong>smaller</strong> of: 90% of this year's tax, or 100% of last year's tax (110% if your AGI was over $150K)</li>
          <li>You're self-employed with no employer withholding taxes for you</li>
        </ol>
        <p>For most OnlyFans creators earning more than ~$5,000/year, the answer is <strong>yes — you need to pay quarterly</strong>.</p>

        <h2 className="text-xl font-semibold pt-4">How to Calculate Your Quarterly Payment</h2>
        <p><strong>Quick estimate:</strong> Take your quarterly net profit, multiply by 30%. That covers federal income tax + self-employment tax (15.3%) for most income levels.</p>
        <p>Example: You net $15,000 in Q2 → set aside ~$4,500 and pay by June 15.</p>
        <p><strong>More precise:</strong> Use Form 1040-ES or a tax calculator. Your effective rate depends on your total income — higher earners pay more.</p>

        <h2 className="text-xl font-semibold pt-4">Safe Harbor Rule: How to Never Pay a Penalty</h2>
        <p>The IRS won't charge penalties if you pay <strong>100% of last year's tax liability</strong> through quarterly payments (or 110% if your AGI exceeded $150K). This is called the "safe harbor" rule.</p>
        <p>Example: Your 2025 tax bill was $8,000. If you pay at least $8,000 through quarterly payments in 2026, you won't owe penalties — even if your actual 2026 tax ends up being $15,000. You'll just owe the difference in April.</p>

        <h2 className="text-xl font-semibold pt-4">What Happens If You Miss a Payment?</h2>
        <p>The IRS calculates penalties based on the <strong>federal short-term rate plus 3%</strong> — currently about 8% annually. The penalty accrues daily from the missed deadline until you pay.</p>
        <p>For someone who owes $8,000 in annual taxes and misses two quarterly payments: the penalty adds up to roughly <strong>$200–$400</strong>. Not devastating, but completely avoidable.</p>
        <p><strong>Can't pay the full amount?</strong> Pay what you can by the deadline. A partial payment reduces the penalty. The worst thing you can do is pay nothing and hope the IRS doesn't notice.</p>

        <h2 className="text-xl font-semibold pt-4">How to Actually Pay</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>IRS Direct Pay:</strong> irs.gov/payments — free, takes 2 minutes</li>
          <li><strong>EFTPS:</strong> eftps.gov — enroll once, schedule all 4 payments</li>
          <li><strong>Mail a check:</strong> With Form 1040-ES voucher</li>
        </ul>
        <p>Always note which tax year and quarter the payment is for.</p>

        <h2 className="text-xl font-semibold pt-4">The Easy Way</h2>
        <p>Manual quarterly tax math is tedious and error-prone. <strong>Staxx</strong> automatically calculates your estimated quarterly tax from your uploaded OnlyFans and Patreon data. It shows you exactly how much to save, when each payment is due, and tracks what you've already paid.</p>

        <div className="rounded-2xl bg-staxx-purple/5 border border-staxx-purple/20 p-6 text-center space-y-3">
          <p className="font-semibold text-staxx-indigo">Never miss a quarterly payment. Try Staxx free for 7 days.</p>
          <Link href="/signup" className="btn-staxx inline-flex h-10 px-6 text-sm">Start Free</Link>
        </div>

        <div className="text-xs text-muted-foreground pt-4 border-t">
          <strong>Disclaimer:</strong> Educational content, not tax advice. Consult a CPA for your specific situation.
        </div>
      </article>
    </div>
  );
}
