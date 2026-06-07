import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") || `${new Date().getFullYear()}-01`;
    const end = searchParams.get("end") || `${new Date().getFullYear()}-12`;

    const { data } = await supabase.from("transactions").select("amount, period").eq("user_id", user.id).gte("period", `${start}-01`).lte("period", `${end}-01`).order("period");

    const monthly: Record<string, { income: number; fees: number }> = {};
    for (const tx of data || []) {
      const m = tx.period.slice(0, 7);
      if (!monthly[m]) monthly[m] = { income: 0, fees: 0 };
      if (tx.amount > 0) monthly[m].income += tx.amount;
      else monthly[m].fees += Math.abs(tx.amount);
    }

    const trend = Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)).map(([month, vals]) => ({ month, income: Math.round(vals.income), profit: Math.round(vals.income - vals.fees) }));
    return NextResponse.json({ trend });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
