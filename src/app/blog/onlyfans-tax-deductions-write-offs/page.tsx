import Link from "next/link";

export const metadata = {
  title: "12 OnlyFans Tax Deductions You're Probably Missing — Save Thousands in 2026",
  description: "Complete list of tax write-offs for OnlyFans creators: equipment, software, home office, props, platform fees, and 8 more categories most creators overlook.",
};

export default function Article() {
  return (
    <div className="min-h-screen bg-staxx-warm-bg py-12 px-4">
      <article className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed text-staxx-indigo">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs rounded-full bg-staxx-purple/10 text-staxx-purple px-2 py-0.5">deductions</span>
            <span className="text-xs rounded-full bg-staxx-purple/10 text-staxx-purple px-2 py-0.5">saving money</span>
          </div>
          <h1 className="text-3xl font-bold font-display">12 OnlyFans Tax Deductions You're Probably Missing</h1>
          <p className="text-muted-foreground text-xs">June 15, 2026 · 7 min read</p>
        </div>

        <p>Most OnlyFans creators only claim about half of the deductions they're entitled to. The average self-employed content creator misses <strong>$3,000–$5,000 per year</strong> in legitimate write-offs — money that goes straight to the IRS instead of staying in your pocket.</p>
        <p>Here's every deduction that applies to OnlyFans and Patreon creators in 2026. The IRS rule is simple: if it's <strong>ordinary and necessary</strong> for your content business, it's deductible.</p>

        {/* 1 */}
        <h2 className="text-xl font-semibold pt-4">1. Cameras, Lighting & Equipment</h2>
        <p>This is the big one. Ring lights, DSLR cameras, tripods, microphones, SD cards, green screens — all fully deductible. If you bought it to make content, it counts.</p>
        <p><strong>Pro tip:</strong> Equipment over $2,500 may need to be depreciated over several years (Section 179). But most creator gear falls under the de minimis safe harbor — expense it all in the year you bought it. Keep receipts showing the purchase date and amount.</p>

        {/* 2 */}
        <h2 className="text-xl font-semibold pt-4">2. Editing Software & Apps</h2>
        <p>Adobe Creative Cloud ($60/month), Final Cut Pro, CapCut Pro, Canva, scheduling tools, analytics apps — all deductible. If you pay a monthly or annual subscription for software you use to create, edit, or promote content, it's a Schedule C expense.</p>

        {/* 3 */}
        <h2 className="text-xl font-semibold pt-4">3. OnlyFans Platform Fees (20%)</h2>
        <p>OnlyFans takes a 20% cut of everything you earn. That's not just an annoyance — it's a legitimate business expense. If you grossed $60,000 on OF this year, that's <strong>$12,000 in deductions</strong> right there.</p>
        <p>Same goes for Patreon (5-12%), Fansly (20%), ManyVids (40%), and payment processing fees from Stripe, PayPal, or CashApp.</p>

        {/* 4 */}
        <h2 className="text-xl font-semibold pt-4">4. Internet & Phone</h2>
        <p>You use your internet and phone for content creation — promoting on Twitter, posting on Reddit, responding to fan messages, uploading content. The percentage used for business is deductible.</p>
        <p><strong>How to calculate:</strong> Estimate what % of your internet/phone use is for OF vs personal. If it's roughly 50/50, deduct 50% of your bills. Don't claim 100% — that's an audit red flag. Document your reasoning.</p>

        {/* 5 */}
        <h2 className="text-xl font-semibold pt-4">5. Home Office / Studio Space</h2>
        <p>If you have a dedicated room or area used <strong>exclusively</strong> for filming, editing, or managing your OF business, you can deduct it. Two methods:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Simplified:</strong> $5 per square foot, up to 300 sq ft = $1,500 max</li>
          <li><strong>Regular:</strong> Actual expenses (rent/mortgage interest, utilities, insurance) × % of home used for business</li>
        </ul>
        <p>Most creators use the simplified method. Less paperwork, same ballpark deduction.</p>

        {/* 6 */}
        <h2 className="text-xl font-semibold pt-4">6. Props, Wardrobe & Makeup</h2>
        <p>Items purchased specifically for content creation are deductible. But there's a nuance: <strong>clothing that can be worn as everyday attire is NOT deductible</strong>, even if you wear it in videos. Costumes, specialty props, and makeup purchased for specific content ARE deductible. Keep a log of what you bought and which content it was for.</p>

        {/* 7 */}
        <h2 className="text-xl font-semibold pt-4">7. Promotion & Advertising</h2>
        <p>Twitter/X ads, Instagram promotions, Reddit ads, shoutouts from other creators, sponsored posts — all marketing costs are deductible. If you pay for promotion on any platform, save those receipts.</p>

        {/* 8 */}
        <h2 className="text-xl font-semibold pt-4">8. Travel for Content</h2>
        <p>If you travel primarily for content creation — a trip to a specific location for a shoot, a creator convention, meeting a collaborator — those costs are deductible. Flights, hotels, meals (50%), and transportation all count. The trip must be <strong>primarily</strong> for business.</p>

        {/* 9 */}
        <h2 className="text-xl font-semibold pt-4">9. Health Insurance Premiums</h2>
        <p>Self-employed creators can deduct 100% of health insurance premiums for themselves, their spouse, and dependents. This is an <strong>above-the-line</strong> deduction — you don't need to itemize. It directly reduces your AGI.</p>

        {/* 10 */}
        <h2 className="text-xl font-semibold pt-4">10. Retirement Contributions</h2>
        <p>As a self-employed creator, you can open a SEP IRA or Solo 401(k) and contribute up to <strong>$66,000 per year</strong> (2026 limit). Every dollar you contribute reduces your taxable income. This is the single most powerful tax reduction tool available to creators making $50K+.</p>

        {/* 11 */}
        <h2 className="text-xl font-semibold pt-4">11. Tax Prep & CPA Fees</h2>
        <p>The cost of preparing your taxes — CPA fees, TurboTax Self-Employed, tax planning consultations — is deductible. If you pay someone to handle your taxes because OF income makes them complicated, that's a business expense.</p>

        {/* 12 */}
        <h2 className="text-xl font-semibold pt-4">12. Education & Training</h2>
        <p>Courses on content creation, photography, video editing, social media marketing, business management — all deductible if they improve your skills for your OF business. Workshops, online courses, and books count.</p>

        <h2 className="text-xl font-semibold pt-4">What NOT to Deduct</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Everyday clothing:</strong> Even if you wear it on camera. The IRS considers this personal.</li>
          <li><strong>Personal grooming:</strong> Haircuts, manicures, gym memberships — unless exclusively for a specific shoot (document it).</li>
          <li><strong>100% of your rent:</strong> Unless your entire home is a studio. Most creators use 10-25%.</li>
          <li><strong>Meals with friends:</strong> "Networking" doesn't count unless there's a clear business purpose.</li>
        </ul>

        <h2 className="text-xl font-semibold pt-4">How to Track All This Without Losing Your Mind</h2>
        <p>You didn't start creating content to become a bookkeeper. That's why we built <strong>Staxx</strong> — it automatically tracks 12 categories of creator-specific deductions from your uploaded OF/Patreon data. It shows you which write-offs you're capturing, which you're missing, and estimates how much each one could save you at tax time.</p>

        <div className="rounded-2xl bg-staxx-purple/5 border border-staxx-purple/20 p-6 text-center space-y-3">
          <p className="font-semibold text-staxx-indigo">See which write-offs you're missing — try Staxx free for 7 days.</p>
          <Link href="/signup" className="btn-staxx inline-flex h-10 px-6 text-sm">Start Free</Link>
        </div>

        <div className="text-xs text-muted-foreground pt-4 border-t">
          <strong>Disclaimer:</strong> This is educational content, not tax advice. Tax laws change and everyone's situation is different. Always consult a licensed CPA before filing.
        </div>
      </article>
    </div>
  );
}
