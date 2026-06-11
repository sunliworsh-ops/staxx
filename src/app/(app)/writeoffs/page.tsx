"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const WRITE_OFFS = [
  { id: "equipment", label: "Camera, lighting & equipment", icon: "📸", desc: "Cameras, tripods, ring lights, microphones" },
  { id: "props_wardrobe", label: "Props, wardrobe & makeup", icon: "👗", desc: "Items used specifically for content creation" },
  { id: "software", label: "Editing software & apps", icon: "💻", desc: "Adobe, Final Cut, Canva Pro subscriptions" },
  { id: "internet_phone", label: "Internet & phone", icon: "📱", desc: "Percentage used for content creation" },
  { id: "home_office", label: "Home office / studio space", icon: "🏠", desc: "Dedicated room or space for filming" },
  { id: "promotion", label: "Promotion & advertising", icon: "📢", desc: "Social media ads, shoutouts" },
  { id: "travel", label: "Travel for content", icon: "✈️", desc: "Trips primarily for content creation" },
  { id: "education", label: "Courses & training", icon: "📚", desc: "Workshops, courses to improve your skills" },
  { id: "accounting", label: "Tax prep & accounting", icon: "🧾", desc: "CPA fees, tax software, bookkeeping services" },
  { id: "health_insurance", label: "Health insurance premiums", icon: "🏥", desc: "Self-employed health insurance deduction" },
  { id: "rent", label: "Rent for studio/office", icon: "🏢", desc: "Separate studio or office space rent" },
  { id: "other_expense", label: "Other expenses", icon: "📋", desc: "Any other business-related costs" },
];

export default function WriteOffsPage() {
  const [expenses, setExpenses] = useState<Record<string, number>>({});
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase.from("transactions").select("category, amount").eq("user_id", user.id).lt("amount", 0).neq("category", "platform_fee")
        .then(({ data }) => {
          const cats: Record<string, number> = {};
          let total = 0;
          for (const tx of data || []) {
            cats[tx.category] = (cats[tx.category] || 0) + Math.abs(tx.amount);
            total += Math.abs(tx.amount);
          }
          setExpenses(cats); setTotalExpenses(total); setLoading(false);
        });
    });
  }, []);

  const captured = WRITE_OFFS.filter((w) => expenses[w.id] > 0).length;
  const pct = WRITE_OFFS.length > 0 ? Math.round((captured / WRITE_OFFS.length) * 100) : 0;
  const fmt = (n: number) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 0 });

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-staxx-indigo font-display">Tax Write-Offs</h1>
        <p className="text-sm text-muted-foreground mt-1">Every dollar you track = less tax you pay.</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-staxx-purple to-staxx-pink p-5 text-white">
        <p className="text-sm opacity-90">Total tracked write-offs</p>
        <p className="text-3xl font-bold mt-1 font-mono">{fmt(totalExpenses)}</p>
        <div className="mt-3 h-2 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} /></div>
        <p className="text-xs mt-2 opacity-75">{captured} of {WRITE_OFFS.length} categories · {pct}% coverage</p>
      </div>

      <div className="space-y-2">
        {WRITE_OFFS.map((item) => {
          const amount = expenses[item.id] || 0;
          return (
            <div key={item.id} className={`rounded-xl border p-4 flex items-start gap-3 transition-all ${amount > 0 ? "bg-green-50 border-green-200" : "bg-white opacity-60"}`}>
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-staxx-indigo">{item.label}</h3>
                  <span className={`text-sm font-mono font-bold shrink-0 ${amount > 0 ? "text-staxx-mint" : "text-muted-foreground"}`}>
                    {amount > 0 ? fmt(amount) : "$0"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>⚠️ Important:</strong> Keep all receipts. This is educational, not tax advice. Consult a CPA.
      </div>
    </div>
  );
}
