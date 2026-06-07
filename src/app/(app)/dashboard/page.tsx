"use client";

import { useEffect, useState, useCallback, type DragEvent } from "react";
import Link from "next/link";
import { Upload, TrendingUp, PieChart, Camera, FileText, ArrowRight, CheckCircle2, Loader2, X, History, Filter } from "lucide-react";
import { authFetch } from "@/lib/api";

interface Stats { income: number; profit: number; estTax: number; taxSaved: number; transactionCount: number; }
interface TrendItem { month: string; income: number; profit: number; }
interface BreakdownItem { name: string; amount: number; pct: number; }
interface Insight { category: string; content: string; }
interface UploadRecord { id: string; file_name: string; file_type: string; source_type: string; transaction_count: number; period_start: string; period_end: string; created_at: string; }

type ImportStep = "idle" | "uploading" | "analyzing" | "done";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Import state
  const [showImport, setShowImport] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [importStep, setImportStep] = useState<ImportStep>("idle");
  const [importResult, setImportResult] = useState<any>(null);
  const [importError, setImportError] = useState("");
  const [importWarnings, setImportWarnings] = useState<string[]>([]);

  // Date filter
  const now = new Date();
  const defaultStart = `${now.getFullYear()}-01`;
  const defaultEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [dateStart, setDateStart] = useState(defaultStart);
  const [dateEnd, setDateEnd] = useState(defaultEnd);

  const refreshData = useCallback(() => {
    Promise.all([
      authFetch(`/api/dashboard/stats?start=${dateStart}&end=${dateEnd}`).then((r) => r.json()),
      authFetch(`/api/dashboard/trend?start=${dateStart}&end=${dateEnd}`).then((r) => r.json()),
      authFetch(`/api/dashboard/breakdown?start=${dateStart}&end=${dateEnd}`).then((r) => r.json()),
      authFetch("/api/ai/insights").then((r) => r.json()),
      authFetch("/api/uploads/history").then((r) => r.json()),
    ]).then(([s, t, b, i, u]) => {
      setStats(s); setTrend(t.trend || []); setBreakdown(b.breakdown || []);
      setInsights(i.insights || []); setUploads(u.uploads || []); setLoading(false);
    });
  }, [dateStart, dateEnd]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/") || f.name.endsWith(".csv"));
    if (dropped.length > 0) setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) return; setImportError(""); setImportWarnings([]); setImportStep("uploading");
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const hasImages = files.some((f) => f.type.startsWith("image/"));
      setImportStep("analyzing");
      const res = await authFetch(hasImages ? "/api/import/screenshot" : "/api/import/csv", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json()).error || "Import failed");
      const data = await res.json();
      setImportResult(data); setImportStep("done");
      if (data.warnings) setImportWarnings(data.warnings);
      refreshData();
    } catch (err) { setImportError(err instanceof Error ? err.message : "Failed"); setImportStep("idle"); }
  }, [files, refreshData]);

  const resetImport = useCallback(() => {
    setFiles([]); setImportStep("idle"); setImportResult(null); setImportError(""); setImportWarnings([]);
  }, []);

  const fmt = (n: number) => "$" + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
  const hasData = stats && stats.transactionCount > 0;

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-staxx-indigo font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {hasData ? "Your money, decoded." : "Ready to see how much you actually made?"}
          </p>
        </div>
        {hasData && (
          <button onClick={() => { setShowImport(!showImport); resetImport(); }}
            className="btn-staxx inline-flex h-10 px-4 text-sm">
            <Upload className="h-4 w-4" /> {showImport ? "Close" : "Import Data"}
          </button>
        )}
      </div>

      {/* Date Filter */}
      {hasData && (
        <div className="flex items-center gap-2 rounded-xl border bg-white p-2">
          <Filter className="h-4 w-4 text-muted-foreground ml-2" />
          <input type="month" value={dateStart} onChange={(e) => setDateStart(e.target.value)}
            className="border-0 bg-transparent text-sm px-1 py-1 focus:outline-none" />
          <span className="text-muted-foreground text-sm">to</span>
          <input type="month" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)}
            className="border-0 bg-transparent text-sm px-1 py-1 focus:outline-none" />
        </div>
      )}

      {/* Import Section */}
      {(showImport || !hasData) && importStep !== "done" && (
        <div className="rounded-2xl border bg-white p-4 space-y-4">
          <div
            className={`upload-zone ${dragOver ? "border-staxx-purple bg-staxx-purple/5" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onClick={() => document.getElementById("dash-file-input")?.click()}
          >
            {files.length === 0 ? (
              <>
                <Upload className="h-10 w-10 text-staxx-purple/60 mb-3" />
                <p className="text-base font-semibold text-staxx-indigo">Drop your earnings here</p>
                <p className="text-xs text-muted-foreground mt-1">Screenshots or CSVs — multiple files OK. AI handles the rest.</p>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span><Camera className="inline h-3 w-3" /> Screenshot</span>
                  <span><FileText className="inline h-3 w-3" /> CSV</span>
                  <span>📁 Multiple files</span>
                </div>
              </>
            ) : (
              <div className="w-full space-y-2">
                <p className="text-sm font-medium text-staxx-indigo">{files.length} file(s) selected</p>
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5">
                    <span>{f.type.startsWith("image/") ? "📸" : "📄"}</span>
                    <span className="truncate flex-1">{f.name}</span>
                    <span>{(f.size / 1024).toFixed(0)}KB</span>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="hover:text-staxx-coral"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Click to add more · Duplicates auto-skipped</p>
              </div>
            )}
            <input id="dash-file-input" type="file" multiple accept="image/*,.csv" className="hidden"
              onChange={(e) => { if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]) }} />
          </div>

          {importStep === "idle" && files.length > 0 && (
            <button onClick={handleAnalyze} className="btn-staxx w-full h-10 text-sm">Analyze All <ArrowRight className="h-3 w-3" /></button>
          )}
          {(importStep === "uploading" || importStep === "analyzing") && (
            <div className="text-center py-4"><Loader2 className="h-6 w-6 text-staxx-purple animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">{importStep === "uploading" ? "Uploading..." : `AI reading ${files.length} file(s)...`}</p></div>
          )}
          {importError && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{importError}</div>}
          {importWarnings.length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700 space-y-1">
              {importWarnings.map((w, i) => <p key={i}>⚠️ {w}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Import Result */}
      {importStep === "done" && importResult && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center space-y-3">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
          <p className="font-semibold text-green-800">
            {importResult.files_processed} file(s) processed · {importResult.total_new_transactions} new transactions
          </p>
          {importResult.total_duplicates_skipped > 0 && <p className="text-xs text-green-600">{importResult.total_duplicates_skipped} duplicates skipped</p>}
          {importResult.files_skipped > 0 && <p className="text-xs text-amber-600">{importResult.files_skipped} files skipped (already uploaded)</p>}
          <button onClick={() => { resetImport(); setShowImport(false); refreshData(); }} className="text-sm text-green-700 underline">Done — close</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-purple"><div className="text-xs opacity-80">You made</div><div className="text-2xl font-bold mt-1 font-mono">{fmt(stats?.income || 0)}</div></div>
        <div className="stat-card-light"><div className="text-xs text-muted-foreground">You kept</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-mint">{fmt(stats?.profit || 0)}</div></div>
        <div className="stat-card-warn"><div className="text-xs text-staxx-amber">Set aside for tax</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-amber">{fmt(stats?.estTax || 0)}</div></div>
        <div className="stat-card-light"><div className="text-xs text-muted-foreground">Already saved</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-coral">{fmt(stats?.taxSaved || 0)}</div></div>
      </div>

      {/* Charts */}
      {hasData && trend.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-staxx-purple" /><h2 className="text-sm font-semibold text-staxx-indigo">Income Trend</h2></div>
          <div className="flex items-end gap-1 h-32">
            {trend.map((t) => {
              const maxIncome = Math.max(1, ...trend.map((x) => x.income));
              return (
                <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{fmt(t.income)}</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-staxx-purple to-staxx-pink" style={{ height: `${Math.max(4, (t.income / maxIncome) * 100)}%` }} />
                  <span className="text-[10px] text-muted-foreground/60">{t.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {breakdown.length > 1 && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-2 mb-4"><PieChart className="h-4 w-4 text-staxx-purple" /><h2 className="text-sm font-semibold text-staxx-indigo">By Platform</h2></div>
          {breakdown.map((p) => (
            <div key={p.name} className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium capitalize w-20">{p.name}</span>
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-staxx-purple" style={{ width: `${p.pct}%` }} /></div>
              <span className="text-sm font-mono text-muted-foreground w-14 text-right">{p.pct}%</span>
            </div>
          ))}
        </div>
      )}

      {insights.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-2 mb-3"><span>🤖</span><h2 className="text-sm font-semibold text-staxx-indigo">AI Insights</h2></div>
          {insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2 rounded-xl bg-staxx-purple/5 p-3 text-sm text-staxx-indigo mb-2"><span>💡</span><span>{ins.content}</span></div>
          ))}
        </div>
      )}

      {/* Upload History */}
      {uploads.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-2 mb-3"><History className="h-4 w-4 text-staxx-purple" /><h2 className="text-sm font-semibold text-staxx-indigo">Upload History</h2></div>
          <div className="space-y-1">
            {uploads.slice(0, 8).map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg hover:bg-muted/50 p-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span>{u.source_type === "screenshot" ? "📸" : "📄"}</span>
                  <span className="truncate text-staxx-indigo">{u.file_name}</span>
                  <span className="text-xs text-muted-foreground">{u.transaction_count} tx</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{u.created_at?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
