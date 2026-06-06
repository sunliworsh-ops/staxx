import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    // This month income
    const { data: monthTx } = await supabase
      .from("transactions")
      .select("amount, category")
      .eq("user_id", user.id)
      .eq("period", thisMonth);

    const income = (monthTx || []).filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const fees = (monthTx || []).filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const profit = income - fees;

    // Current quarter tax estimate
    const quarter = `2026-Q${Math.ceil((now.getMonth() + 1) / 3)}`;
    const { data: taxData } = await supabase
      .from("tax_estimates")
      .select("total_tax_est, amount_saved")
      .eq("user_id", user.id)
      .eq("quarter", quarter)
      .maybeSingle();

    const estTax = taxData?.total_tax_est || Math.round(profit * 0.3 * 100) / 100;
    const taxSaved = taxData?.amount_saved || 0;

    return NextResponse.json({
      income: Math.round(income * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      estTax,
      taxSaved,
      transactionCount: (monthTx || []).length,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
