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

    const { data } = await supabase.from("transactions").select("platform, amount").eq("user_id", user.id).gte("period", `${start}-01`).lte("period", `${end}-01`);

    const platforms: Record<string, number> = {};
    for (const tx of data || []) {
      platforms[tx.platform || "other"] = (platforms[tx.platform || "other"] || 0) + tx.amount;
    }
    const total = Object.values(platforms).reduce((s, v) => s + Math.abs(v), 0) || 1;
    const breakdown = Object.entries(platforms).map(([name, amount]) => ({ name, amount, pct: Math.round((Math.abs(amount) / total) * 100) }));
    return NextResponse.json({ breakdown });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
