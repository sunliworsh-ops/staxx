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

    const { data: tx } = await supabase.from("transactions").select("amount").eq("user_id", user.id).gte("period", start).lte("period", end);
    const income = (tx || []).filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const fees = (tx || []).filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const profit = income - fees;
    const estTax = Math.round(profit * 0.3);

    return NextResponse.json({ income, profit, estTax, taxSaved: 0, transactionCount: tx?.length || 0 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
