"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AQR_tnfN5I4ZXURBbUfyUcXBUUHvPh_kLuvC2xU4vk3hyT8__fxriomEeOQXjvS7VCPHdKTb-3saTZSN&vault=true&intent=subscription";
    script.onload = () => {
      if ((window as any).paypal) {
        (window as any).paypal.Buttons({
          style: { shape: "rect", color: "gold", layout: "horizontal", label: "subscribe" },
          createSubscription: (_d: any, a: any) => a.subscription.create({ plan_id: "P-2VU04307H85349832NIWDFCQ" }),
          onApprove: () => alert("Thanks! Refresh the page and sign in to continue."),
        }).render("#paypal-hero");
      }
    };
    document.body.appendChild(script);
  }, []);
  return (
    <div className="bg-staxx-warm-bg">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-12 sm:pt-32 sm:pb-16 text-center">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#C4B5FD,transparent)]" />
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-staxx-purple text-white text-2xl font-bold shadow-purple">S</div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-1.5 text-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-staxx-mint animate-pulse" />
            Built for creators, by creators
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-staxx-indigo font-display">
            Your OnlyFans money,<br />
            <span className="text-staxx-purple">finally under control.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload a screenshot. AI handles the math. Know exactly how much you made, what to save for taxes, and what to write off. <strong>No CPA required.</strong>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-staxx h-12 px-8 text-sm">Start Free — No Credit Card</Link>
            <Link href="/login" className="inline-flex h-12 items-center rounded-xl border bg-white px-8 text-sm font-semibold text-staxx-indigo hover:bg-muted transition-colors">Sign In</Link>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-staxx-indigo hover:bg-amber-300 transition-colors">
              👑 Upgrade to Pro — $19.99/mo
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">7-day free trial · No credit card · No real name required</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-staxx-indigo mb-12">Three steps to clarity</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: 1, title: "Upload", desc: "Screenshot your OnlyFans dashboard or export a CSV. Drop it in.", preview: "📱 Screenshot · 📄 CSV · 🔒 Private" },
              { step: 2, title: "AI Works", desc: "We extract every dollar — subscriptions, PPV, tips, fees. Auto-tagged by platform.", preview: "🤖 AI classification · 🏷️ Multi-platform · ✅ Confidence scores" },
              { step: 3, title: "Know Your Numbers", desc: "Real profit. Estimated quarterly tax. Write-offs you're missing. Tax-ready export.", preview: "📊 Dashboard · 💡 Tax tips · 📤 Schedule C export" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-staxx-purple text-white font-bold mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-staxx-indigo">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                <p className="mt-3 text-xs text-staxx-purple bg-staxx-purple/5 rounded-lg p-2">{item.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll catch */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-staxx-indigo mb-4">What you&apos;ll catch</h2>
          <p className="text-center text-muted-foreground mb-12">These cost creators thousands every year. Staxx spots them instantly.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Hidden Fees", desc: "OnlyFans 20% cut. Patreon 8-12%. ManyVids 40%. Know exactly what platforms are taking." },
              { title: "Missed Write-Offs", desc: "Equipment, props, home studio, internet, travel. 12 categories of deductions you might be missing." },
              { title: "Tax Surprises", desc: "Quarterly estimates so you're never blindsided in April. Know what to save, when to pay." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-staxx-warm-bg p-5">
                <h3 className="font-semibold text-staxx-indigo">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-24 px-4 text-center bg-staxx-indigo text-white">
        <h2 className="text-3xl font-bold">Stack smarter. Create freer.</h2>
        <p className="mt-4 text-white/60 max-w-md mx-auto">The financial tracker built for OnlyFans creators. No real name needed. No CPA required.</p>
        <Link href="/signup" className="btn-staxx inline-flex h-12 px-8 mt-8 text-sm bg-white text-staxx-purple">Start Free</Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Staxx. Staxx provides tax-ready data, not tax advice. Always consult a licensed CPA.<br />
          <Link href="/pricing" className="underline underline-offset-2 hover:text-staxx-purple">Pricing</Link> · <Link href="/login" className="underline underline-offset-2 hover:text-staxx-purple">Sign In</Link>
        </p>
      </footer>
    </div>
  );
}
