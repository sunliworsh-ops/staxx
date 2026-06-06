import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Last 12 months of income data
    const { data } = await supabase
      .from("transactions")
      .select("amount, period")
      .eq("user_id", user.id)
      .order("period", { ascending: true })
      .limit(500);

    // Group by month
    const monthly: Record<string, { income: number; fees: number }> = {};
    for (const tx of data || []) {
      const month = tx.period.slice(0, 7);
      if (!monthly[month]) monthly[month] = { income: 0, fees: 0 };
      if (tx.amount > 0) monthly[month].income += tx.amount;
      else monthly[month].fees += Math.abs(tx.amount);
    }

    const trend = Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, values]) => ({
        month,
        income: Math.round(values.income * 100) / 100,
        fees: Math.round(values.fees * 100) / 100,
        profit: Math.round((values.income - values.fees) * 100) / 100,
      }));

    return NextResponse.json({ trend });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
