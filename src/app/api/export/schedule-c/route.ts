import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const yearStart = `${new Date().getFullYear()}-01-01`;
    const { data: tx } = await supabase.from("transactions").select("amount, category, platform").eq("user_id", user.id).gte("period", yearStart);

    const grossReceipts = (tx || []).filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const fees = (tx || []).filter((t) => t.category === "platform_fee").reduce((s, t) => s + Math.abs(t.amount), 0);
    const expensesByCat: Record<string, number> = {};
    for (const t of tx || []) {
      if (t.amount < 0 && t.category !== "platform_fee") {
        expensesByCat[t.category] = (expensesByCat[t.category] || 0) + Math.abs(t.amount);
      }
    }
    const totalDeductions = Object.values(expensesByCat).reduce((s, v) => s + v, 0);
    const netProfit = grossReceipts - fees - totalDeductions;

    return NextResponse.json({
      year: new Date().getFullYear(),
      grossReceipts: Math.round(grossReceipts * 100) / 100,
      platformFees: Math.round(fees * 100) / 100,
      deductions: Object.entries(expensesByCat).map(([cat, amt]) => ({ category: cat, amount: Math.round(amt * 100) / 100 })),
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      transactionCount: tx?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
