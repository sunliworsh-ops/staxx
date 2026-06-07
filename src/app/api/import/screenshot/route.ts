import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifyScreenshot } from "@/lib/ai";
import { createHash } from "crypto";

function hashBuffer(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    // Fallback: single file with key "file"
    const singleFile = formData.get("file") as File | null;
    const allFiles = files.length > 0 ? files : (singleFile ? [singleFile] : []);
    if (allFiles.length === 0) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const results: any[] = [];
    const warnings: string[] = [];
    let totalNewTx = 0, totalSkipped = 0;

    // Get existing data for dedup
    const { data: existingTx } = await supabase.from("transactions").select("platform, category, amount, period").eq("user_id", user.id);
    const existingHashes = new Set<string>();
    const { data: existingUploads } = await supabase.from("uploads").select("content_hash, period_start, period_end").eq("user_id", user.id);
    for (const u of existingUploads || []) {
      if (u.content_hash) existingHashes.add(u.content_hash);
    }

    for (const file of allFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const contentHash = hashBuffer(buffer);
      const base64 = buffer.toString("base64");

      // Check hash duplicate
      if (existingHashes.has(contentHash)) {
        warnings.push(`"${file.name}" was already uploaded before — skipped`);
        continue;
      }
      existingHashes.add(contentHash);

      // AI classify
      let result;
      try {
        result = await classifyScreenshot(base64, file.type);
      } catch (e) {
        warnings.push(`"${file.name}" — AI could not read this image`);
        continue;
      }

      // Check period overlap
      const periods = [...new Set(result.transactions.map((t) => t.period || ""))].filter(Boolean);
      const periodStart = periods.sort()[0] || null;
      const periodEnd = periods.sort().reverse()[0] || null;

      for (const eu of existingUploads || []) {
        if (eu.period_start && eu.period_end && periodStart && periodEnd) {
          if (periodStart <= eu.period_end && periodEnd >= eu.period_start) {
            warnings.push(`"${file.name}" — data from ${periodStart} to ${periodEnd} overlaps with a previous upload`);
          }
        }
      }

      // Transaction dedup
      const existingKeys = new Set((existingTx || []).map((e) => `${e.platform}|${e.category}|${e.amount}|${e.period?.slice(0, 7)}`));
      const newTx = result.transactions.filter((t) => {
        const p = t.period || new Date().toISOString().slice(0, 7);
        return !existingKeys.has(`${t.platform}|${t.category}|${t.amount}|${p}`);
      });

      const skipped = result.transactions.length - newTx.length;
      totalSkipped += skipped;

      if (newTx.length > 0) {
        const toInsert = newTx.map((t) => ({
          user_id: user.id, platform: t.platform, category: t.category,
          amount: t.amount, period: t.period ? `${t.period}-01` : new Date().toISOString().slice(0, 7) + "-01",
          source_type: "screenshot", ai_confidence: t.confidence,
        }));
        const { error } = await supabase.from("transactions").insert(toInsert);
        if (error) throw new Error(error.message);
        totalNewTx += newTx.length;
      }

      // Record upload
      await supabase.from("uploads").insert({
        user_id: user.id, file_name: file.name, file_type: file.type,
        file_size: file.size, content_hash: contentHash, source_type: "screenshot",
        transaction_count: newTx.length, period_start: periodStart ? `${periodStart}-01` : null,
        period_end: periodEnd ? `${periodEnd}-01` : null,
      });

      results.push({
        file: file.name,
        transactions: newTx,
        income: newTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
        fees: newTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
        skipped,
      });
    }

    return NextResponse.json({
      success: true,
      files_processed: results.length,
      files_skipped: allFiles.length - results.length,
      total_new_transactions: totalNewTx,
      total_duplicates_skipped: totalSkipped,
      results,
      warnings: warnings.length > 0 ? warnings : undefined,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
