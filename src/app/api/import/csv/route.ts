import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifyCSV } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const csvContent = await file.text();
    if (!csvContent.trim()) {
      return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
    }

    const result = await classifyCSV(csvContent);

    // Dedup
    const periods = [...new Set(result.transactions.map((t) => t.period || new Date().toISOString().slice(0, 7)))];
    const { data: existing } = await supabase
      .from("transactions")
      .select("platform, category, amount, period")
      .eq("user_id", user.id)
      .in("period", periods.map((p) => `${p}-01`));

    const existingKeys = new Set(
      (existing || []).map((e) => `${e.platform}|${e.category}|${e.amount}|${e.period?.slice(0, 7)}`)
    );

    const newTx = result.transactions.filter((t) => {
      const period = t.period || new Date().toISOString().slice(0, 7);
      return !existingKeys.has(`${t.platform}|${t.category}|${t.amount}|${period}`);
    });

    const skipped = result.transactions.length - newTx.length;

    if (newTx.length > 0) {
      const toInsert = newTx.map((t) => ({
        user_id: user.id,
        platform: t.platform,
        category: t.category,
        amount: t.amount,
        period: t.period ? `${t.period}-01` : new Date().toISOString().slice(0, 7) + "-01",
        source_type: "csv",
        ai_confidence: t.confidence,
      }));
      const { error } = await supabase.from("transactions").insert(toInsert);
      if (error) throw new Error(`DB insert failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      transactions: newTx,
      unrecognized: result.unrecognized,
      total_income: newTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      total_fees: newTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
      duplicates_skipped: skipped,
    });
  } catch (error) {
    console.error("Import failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import failed" },
      { status: 500 }
    );
  }
}
