import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`;

    const { data } = await supabase
      .from("transactions")
      .select("platform, amount")
      .eq("user_id", user.id)
      .eq("period", thisMonth);

    const platforms: Record<string, number> = {};
    for (const tx of data || []) {
      const p = tx.platform || "other";
      platforms[p] = (platforms[p] || 0) + tx.amount;
    }

    const total = Object.values(platforms).reduce((s, v) => s + Math.abs(v), 0) || 1;
    const breakdown = Object.entries(platforms).map(([name, amount]) => ({
      name,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round((Math.abs(amount) / total) * 100),
    }));

    return NextResponse.json({ breakdown });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
