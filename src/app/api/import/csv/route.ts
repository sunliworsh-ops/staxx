import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifyCSV } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check trial status
    const { data: profile } = await supabase.from("profiles").select("trial_ends_at, subscription_tier").eq("id", user.id).single();
    const tier = profile?.subscription_tier || "free";
    const trialEnded = profile?.trial_ends_at && new Date(profile.trial_ends_at) < new Date();
    if (tier === "free" && trialEnded) {
      return NextResponse.json({ error: "Your 7-day free trial has ended. Upgrade to Pro to continue." }, { status: 402 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const allFiles = (formData.getAll("files") as File[]);
    const files = allFiles.length > 0 ? allFiles : (file ? [file] : []);
    if (files.length === 0) return NextResponse.json({ error: "No files" }, { status: 400 });

    let totalNew = 0, totalSkipped = 0;
    const results: any[] = [];
    const warnings: string[] = [];

    for (const f of files) {
      const csvContent = await f.text();
      if (!csvContent.trim()) { warnings.push(`"${f.name}" is empty`); continue; }

      let result;
      try { result = await classifyCSV(csvContent); }
      catch (e) { warnings.push(`"${f.name}" — AI could not parse`); continue; }

      // Upload record first
      const { data: uploadData } = await supabase.from("uploads").insert({
        user_id: user.id, file_name: f.name, file_type: f.type,
        file_size: f.size, source_type: "csv", transaction_count: result.transactions.length,
      }).select("id").single();
      const uploadId = uploadData?.id;

      // Dedup
      const periods = [...new Set(result.transactions.map((t) => t.period || ""))].filter(Boolean);
      const { data: existing } = await supabase.from("transactions").select("platform, category, amount, period").eq("user_id", user.id);
      const existingKeys = new Set((existing || []).map((e) => `${e.platform}|${e.category}|${e.amount}|${e.period?.slice(0, 7)}`));

      const newTx = result.transactions.filter((t) => {
        const p = t.period || new Date().toISOString().slice(0, 7);
        return !existingKeys.has(`${t.platform}|${t.category}|${t.amount}|${p}`);
      });
      totalSkipped += result.transactions.length - newTx.length;

      if (newTx.length > 0 && uploadId) {
        await supabase.from("transactions").insert(newTx.map((t) => ({
          user_id: user.id, platform: t.platform, category: t.category,
          amount: t.amount, period: t.period ? `${t.period}-01` : new Date().toISOString().slice(0, 7) + "-01",
          source_type: "csv", ai_confidence: t.confidence, upload_id: uploadId,
        })));
        totalNew += newTx.length;
      }

      results.push({
        file: f.name,
        transactions: newTx,
        income: newTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
        fees: newTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
      });
    }

    return NextResponse.json({
      success: true, files_processed: results.length,
      total_new_transactions: totalNew, total_duplicates_skipped: totalSkipped,
      results, warnings: warnings.length > 0 ? warnings : undefined,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
