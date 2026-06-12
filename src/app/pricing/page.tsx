import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-staxx-warm-bg py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-staxx-indigo font-display">Simple pricing</h1>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready.</p>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto lg:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border bg-white p-8">
          <h3 className="text-lg font-semibold text-staxx-indigo">Free</h3>
          <div className="mt-3"><span className="text-4xl font-bold text-staxx-indigo">$0</span><span className="text-muted-foreground">/month</span></div>
          <p className="mt-2 text-sm text-muted-foreground">For getting started</p>
          <ul className="mt-6 space-y-2">
            {["3 imports per month","Basic dashboard","Income trend chart","Platform breakdown"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-staxx-mint" />{f}</li>
            ))}
          </ul>
          <Link href="/signup" className="btn-staxx mt-6 w-full h-11 text-sm">Start Free</Link>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border-2 border-staxx-purple bg-white p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-staxx-purple px-4 py-1 text-xs font-semibold text-white">Most Popular</div>
          <h3 className="text-lg font-semibold text-staxx-indigo">Pro</h3>
          <div className="mt-3"><span className="text-4xl font-bold text-staxx-indigo">$19.99</span><span className="text-muted-foreground">/month</span></div>
          <p className="mt-2 text-sm text-muted-foreground">$199/year — save $41</p>
          <ul className="mt-6 space-y-2">
            {["Unlimited imports","AI insights & tax tips","Tax Write-Offs checklist","Schedule C export (PDF/CSV)","Full transaction history","Priority email support"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-staxx-purple" />{f}</li>
            ))}
          </ul>
          <Link href="/signup" className="btn-staxx mt-6 w-full h-11 text-sm">Start Free Trial</Link>
          <p className="text-xs text-muted-foreground text-center mt-2">14 days free · no credit card</p>
        </div>
      </div>
    </div>
  );
}
