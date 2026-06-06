import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: tx } = await supabase.from("transactions").select("period, platform, category, amount").eq("user_id", user.id).order("period");

    const header = "Date,Platform,Category,Amount\n";
    const rows = (tx || []).map((t) => `${t.period.slice(0, 10)},${t.platform},${t.category},${t.amount}`).join("\n");
    const csv = header + rows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="staxx-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
