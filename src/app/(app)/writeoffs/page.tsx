"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const WRITE_OFFS = [
  { id: "equipment", label: "Camera, lighting & equipment", icon: "📸", desc: "Full cost of cameras, tripods, ring lights, microphones" },
  { id: "props", label: "Props, wardrobe & makeup", icon: "👗", desc: "Items used specifically for content creation" },
  { id: "software", label: "Editing software & apps", icon: "💻", desc: "Adobe, Final Cut, Canva Pro subscriptions" },
  { id: "internet", label: "Internet & phone", icon: "📱", desc: "Percentage used for content creation" },
  { id: "home_office", label: "Home office / studio space", icon: "🏠", desc: "Dedicated room or space used for filming" },
  { id: "promotion", label: "Promotion & advertising", icon: "📢", desc: "Social media ads, shoutouts, Twitter promo" },
  { id: "fees", label: "Platform fees & commissions", icon: "💸", desc: "OnlyFans 20%, Patreon fees, payment processing" },
  { id: "travel", label: "Travel for content", icon: "✈️", desc: "Trips primarily for content creation" },
  { id: "education", label: "Courses & training", icon: "📚", desc: "Workshops, courses to improve your content skills" },
  { id: "accounting", label: "Tax prep & accounting", icon: "🧾", desc: "CPA fees, tax software, bookkeeping services" },
  { id: "health_insurance", label: "Health insurance premiums", icon: "🏥", desc: "Self-employed health insurance deduction" },
  { id: "retirement", label: "Retirement contributions", icon: "💰", desc: "SEP IRA or Solo 401(k) contributions" },
];

export default function WriteOffsPage() {
  const [captured, setCaptured] = useState(0);
  const [pct, setPct] = useState(0);
  const [userCategories, setUserCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("transactions").select("category").eq("user_id", user.id).lt("amount", 0).then(({ data }) => {
        const cats = new Set((data || []).map((t: any) => t.category));
        setUserCategories(cats);
        const c = WRITE_OFFS.filter((w) => cats.has(w.id)).length;
        setCaptured(c);
        setPct(Math.round((c / WRITE_OFFS.length) * 100));
      });
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-staxx-indigo font-display">Tax Write-Offs</h1>
        <p className="text-sm text-muted-foreground mt-1">OnlyFans-specific deductions you might be missing.</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-staxx-purple to-staxx-pink p-5 text-white">
        <p className="text-sm opacity-90">You&apos;ve captured</p>
        <p className="text-3xl font-bold mt-1">{captured} of {WRITE_OFFS.length}</p>
        <div className="mt-3 h-2 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} /></div>
        <p className="text-xs mt-2 opacity-75">{pct}% of common write-offs tracked</p>
      </div>

      <div className="space-y-2">
        {WRITE_OFFS.map((item) => {
          const found = userCategories.has(item.id);
          return (
            <div key={item.id} className={`rounded-xl border p-4 flex items-start gap-3 ${found ? "bg-green-50 border-green-200" : "bg-white"}`}>
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-staxx-indigo">{item.label}</h3>
                  {found && <span className="text-xs rounded-full bg-green-100 text-green-700 px-2 py-0.5">✓ captured</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>⚠️ Important:</strong> This is educational, not tax advice. Always consult a CPA.
      </div>
    </div>
  );
}
