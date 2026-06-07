"use client";

import { useEffect, useState, useCallback, type DragEvent } from "react";
import Link from "next/link";
import { Upload, TrendingUp, PieChart, Camera, FileText, ArrowRight, CheckCircle2, Loader2, X } from "lucide-react";
import { authFetch } from "@/lib/api";

interface Stats { income: number; profit: number; estTax: number; taxSaved: number; transactionCount: number; }
interface TrendItem { month: string; income: number; profit: number; }
interface BreakdownItem { name: string; amount: number; pct: number; }
interface Insight { category: string; content: string; }

type ImportStep = "idle" | "uploading" | "analyzing" | "done";

interface ImportResult {
  transactions: Array<{ platform: string; category: string; amount: number; confidence: number }>;
  unrecognized: Array<{ text: string; amount: number }>;
  total_income: number; total_fees: number; duplicates_skipped?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  // Import state
  const [showImport, setShowImport] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [importStep, setImportStep] = useState<ImportStep>("idle");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState("");

  const refreshData = useCallback(() => {
    Promise.all([
      authFetch("/api/dashboard/stats").then((r) => r.json()),
      authFetch("/api/dashboard/trend").then((r) => r.json()),
      authFetch("/api/dashboard/breakdown").then((r) => r.json()),
      authFetch("/api/ai/insights").then((r) => r.json()),
    ]).then(([s, t, b, i]) => {
      setStats(s); setTrend(t.trend || []); setBreakdown(b.breakdown || []); setInsights(i.insights || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return; setImportError(""); setImportStep("uploading");
    try {
      const formData = new FormData(); formData.append("file", file);
      const isImage = file.type.startsWith("image/");
      setImportStep("analyzing");
      const res = await authFetch(isImage ? "/api/import/screenshot" : "/api/import/csv", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json()).error || "Import failed");
      const data: ImportResult = await res.json();
      setImportResult(data); setImportStep("done");
      refreshData();
    } catch (err) { setImportError(err instanceof Error ? err.message : "Failed"); setImportStep("idle"); }
  }, [file, refreshData]);

  const resetImport = useCallback(() => {
    setFile(null); setImportStep("idle"); setImportResult(null); setImportError("");
  }, []);

  const fmt = (n: number) => "$" + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
  const hasData = stats && stats.transactionCount > 0;
  const maxIncome = Math.max(1, ...trend.map((t) => t.income));

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-staxx-indigo font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {hasData ? "Your money, decoded." : "Ready to see how much you actually made?"}
          </p>
        </div>
        {hasData && (
          <button onClick={() => setShowImport(!showImport)} className="btn-staxx inline-flex h-10 px-4 text-sm">
            <Upload className="h-4 w-4" /> {showImport ? "Close" : "Import Data"}
          </button>
        )}
      </div>

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
            {!file ? (
              <>
                <Upload className="h-10 w-10 text-staxx-purple/60 mb-3" />
                <p className="text-base font-semibold text-staxx-indigo">Drop your earnings here</p>
                <p className="text-xs text-muted-foreground mt-1">Screenshot or CSV — OnlyFans, Patreon, anywhere. AI does the rest.</p>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span><Camera className="inline h-3 w-3" /> Screenshot</span>
                  <span><FileText className="inline h-3 w-3" /> CSV</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full max-w-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border">
                  {file.type.startsWith("image/") ? <Camera className="h-5 w-5 text-staxx-purple" /> : <FileText className="h-5 w-5 text-staxx-purple" />}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-staxx-indigo text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted"><X className="h-3 w-3" /></button>
              </div>
            )}
            <input id="dash-file-input" type="file" accept="image/*,.csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          {importStep === "idle" && file && (
            <button onClick={handleAnalyze} className="btn-staxx w-full h-10 text-sm">Analyze <ArrowRight className="h-3 w-3" /></button>
          )}
          {(importStep === "uploading" || importStep === "analyzing") && (
            <div className="text-center py-4"><Loader2 className="h-6 w-6 text-staxx-purple animate-spin mx-auto" /><p className="text-sm text-muted-foreground mt-2">{importStep === "uploading" ? "Uploading..." : "AI reading your numbers..."}</p></div>
          )}
          {importError && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{importError}</div>}
        </div>
      )}

      {/* Import Result */}
      {importStep === "done" && importResult && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center space-y-3">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
          <p className="font-semibold text-green-800">AI found ${importResult.total_income.toLocaleString()} across {importResult.transactions.length} tx</p>
          {importResult.duplicates_skipped ? <p className="text-xs text-green-600">{importResult.duplicates_skipped} duplicates skipped</p> : null}
          <button onClick={() => { resetImport(); setShowImport(false); refreshData(); }} className="text-sm text-green-700 underline">Done — refresh dashboard</button>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card-purple"><div className="text-xs opacity-80">You made</div><div className="text-2xl font-bold mt-1 font-mono">{fmt(stats.income)}</div></div>
          <div className="stat-card-light"><div className="text-xs text-muted-foreground">You kept</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-mint">{fmt(stats.profit)}</div></div>
          <div className="stat-card-warn"><div className="text-xs text-staxx-amber">Set aside for tax</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-amber">{fmt(stats.estTax)}</div></div>
          <div className="stat-card-light"><div className="text-xs text-muted-foreground">Already saved</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-coral">{fmt(stats.taxSaved)}</div></div>
        </div>
      )}

      {/* Charts */}
      {hasData && trend.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-staxx-purple" /><h2 className="text-sm font-semibold text-staxx-indigo">Income Trend</h2></div>
          <div className="flex items-end gap-1 h-32">
            {trend.map((t) => (
              <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{fmt(t.income)}</span>
                <div className="w-full rounded-t-md bg-gradient-to-t from-staxx-purple to-staxx-pink" style={{ height: `${Math.max(4, (t.income / maxIncome) * 100)}%` }} />
                <span className="text-[10px] text-muted-foreground/60">{t.month.slice(5)}</span>
              </div>
            ))}
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
    </div>
  );
}
