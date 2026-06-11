"use client";

import { useEffect, useState, useCallback, type DragEvent } from "react";
import { Upload, Camera, FileText, ArrowRight, CheckCircle2, Loader2, X, History, Trash2, ChevronDown, AlertTriangle } from "lucide-react";
import { authFetch } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Stats { income: number; profit: number; estTax: number; taxSaved: number; transactionCount: number; }
interface TrendItem { month: string; income: number; profit: number; }
interface BreakdownItem { name: string; amount: number; pct: number; }
interface Insight { category: string; content: string; }
interface UploadRecord { id: string; file_name: string; file_type: string; source_type: string; transaction_count: number; period_start: string; period_end: string; created_at: string; }

type ImportStep = "idle" | "uploading" | "analyzing" | "done";

const DATE_PRESETS = [
  { label: "Past week", value: "1w" }, { label: "Past 2 weeks", value: "2w" }, { label: "Past 3 weeks", value: "3w" },
  { label: "Past month", value: "1m" }, { label: "Past 2 months", value: "2m" }, { label: "Past 3 months", value: "3m" },
  { label: "Past 4 months", value: "4m" }, { label: "Past 5 months", value: "5m" }, { label: "Past 6 months", value: "6m" },
  { label: "Past year", value: "year" }, { label: "All time", value: "all" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [importStep, setImportStep] = useState<ImportStep>("idle");
  const [importResult, setImportResult] = useState<any>(null);
  const [importError, setImportError] = useState("");
  const [importWarnings, setImportWarnings] = useState<string[]>([]);

  const [datePreset, setDatePreset] = useState("3m");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const [previewUpload, setPreviewUpload] = useState<UploadRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getDateRange = useCallback(() => {
    const now = new Date(); now.setHours(23, 59, 59, 999);
    const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const past = new Date(now);
    switch (datePreset) {
      case "1w": past.setDate(past.getDate() - 7); break;
      case "2w": past.setDate(past.getDate() - 14); break;
      case "3w": past.setDate(past.getDate() - 21); break;
      case "1m": past.setMonth(past.getMonth() - 1); break;
      case "2m": past.setMonth(past.getMonth() - 2); break;
      case "3m": past.setMonth(past.getMonth() - 3); break;
      case "4m": past.setMonth(past.getMonth() - 4); break;
      case "5m": past.setMonth(past.getMonth() - 5); break;
      case "6m": past.setMonth(past.getMonth() - 6); break;
      case "year": past.setFullYear(past.getFullYear() - 1); break;
      default: past.setFullYear(2020);
    }
    return { start: past.toISOString().slice(0, 10), end };
  }, [datePreset]);

  const refreshData = useCallback(() => {
    const { start, end } = getDateRange();
    Promise.all([
      authFetch(`/api/dashboard/stats?start=${start}&end=${end}`).then((r) => r.json()),
      authFetch(`/api/dashboard/trend?start=${start}&end=${end}`).then((r) => r.json()),
      authFetch(`/api/dashboard/breakdown?start=${start}&end=${end}`).then((r) => r.json()),
      authFetch("/api/ai/insights").then((r) => r.json()),
      authFetch("/api/uploads/history").then((r) => r.json()),
    ]).then(([s, t, b, i, u]) => {
      setStats(s); setTrend(t.trend || []); setBreakdown(b.breakdown || []);
      setInsights(i.insights || []); setUploads(u.uploads || []); setLoading(false);
    });
  }, [getDateRange]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/") || f.name.endsWith(".csv"));
    if (dropped.length > 0) setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) return; setImportError(""); setImportWarnings([]); setImportStep("uploading");
    try {
      const formData = new FormData(); files.forEach((f) => formData.append("files", f));
      setImportStep("analyzing");
      const hasImages = files.some((f) => f.type.startsWith("image/"));
      const res = await authFetch(hasImages ? "/api/import/screenshot" : "/api/import/csv", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json()).error || "Import failed");
      const data = await res.json();
      setImportResult(data); setImportStep("done");
      if (data.warnings) setImportWarnings(data.warnings);
      refreshData();
    } catch (err) { setImportError(err instanceof Error ? err.message : "Failed"); setImportStep("idle"); }
  }, [files, refreshData]);

  const resetImport = useCallback(() => { setFiles([]); setImportStep("idle"); setImportResult(null); setImportError(""); setImportWarnings([]); }, []);

  const handleDeleteUpload = async (id: string) => {
    setDeleting(true);
    await authFetch(`/api/uploads/${id}`, { method: "DELETE" });
    setUploads((prev) => prev.filter((u) => u.id !== id));
    setPreviewUpload(null); setDeleteConfirm(null); setDeleting(false);
    refreshData();
  };

  const fmt = (n: number) => "$" + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
  const hasData = stats && stats.transactionCount > 0;
  const barWidth = trend.length <= 3 ? 40 : trend.length <= 6 ? 30 : undefined;

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading your dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Header + Date selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-staxx-indigo font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{hasData ? "Your money, decoded." : "Ready to see how much you actually made?"}</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium text-staxx-indigo hover:bg-muted transition-colors">
            {DATE_PRESETS.find((p) => p.value === datePreset)?.label || "Custom"}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {showDateDropdown && (
            <div className="absolute right-0 mt-1 w-48 rounded-xl border bg-white shadow-lg z-10 py-1 max-h-64 overflow-y-auto"
              onMouseLeave={() => setShowDateDropdown(false)}>
              {DATE_PRESETS.map((p) => (
                <button key={p.value} onClick={() => { setDatePreset(p.value); setShowDateDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-staxx-purple/5 transition-colors ${datePreset === p.value ? "text-staxx-purple font-semibold" : "text-muted-foreground"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Zone — always visible */}
      <div className={`rounded-2xl border bg-white transition-all ${!hasData ? "p-6" : "p-3"}`}>
        <div
          className={`upload-zone ${dragOver ? "border-staxx-purple bg-staxx-purple/5" : ""} ${!hasData ? "py-8" : "py-3"}`}
          onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onClick={() => !files.length && document.getElementById("dash-file-input")?.click()}>
          {files.length === 0 ? (
            <div className="text-center">
              <Upload className="h-8 w-8 text-staxx-purple/50 mx-auto mb-2" />
              <p className="text-sm font-semibold text-staxx-indigo">Drop earnings or receipts here</p>
              <p className="text-xs text-muted-foreground mt-0.5">Screenshots of income AND expenses — AI reads both</p>
            </div>
          ) : (
            <div className="w-full space-y-1.5">
              <p className="text-sm font-medium text-staxx-indigo text-center">{files.length} file(s) ready</p>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5">
                  <span>{f.type.startsWith("image/") ? "📸" : "📄"}</span>
                  <span className="truncate flex-1">{f.name}</span>
                  <span>{(f.size / 1024).toFixed(0)}KB</span>
                  <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="hover:text-staxx-coral"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
          <input id="dash-file-input" type="file" multiple accept="image/*,.csv" className="hidden"
            onChange={(e) => { if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]) }} />
        </div>

        {importStep === "idle" && files.length > 0 && (
          <button onClick={handleAnalyze} className="btn-staxx w-full h-10 mt-3 text-sm">Analyze <ArrowRight className="h-3 w-3" /></button>
        )}
        {(importStep === "uploading" || importStep === "analyzing") && (
          <div className="text-center py-3 mt-3"><Loader2 className="h-5 w-5 text-staxx-purple animate-spin mx-auto" />
            <p className="text-xs text-muted-foreground mt-1">{importStep === "uploading" ? "Uploading..." : "AI reading income & expenses..."}</p></div>
        )}
        {importError && <div className="rounded-xl bg-red-50 border border-red-200 p-3 mt-3 text-sm text-red-700">{importError}</div>}
        {importWarnings.map((w, i) => <p key={i} className="text-xs text-amber-600 mt-1">⚠️ {w}</p>)}
        {importStep === "done" && importResult && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-3 mt-3 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
            <p className="text-sm font-semibold text-green-800 mt-1">{importResult.total_new_transactions} new tx · {importResult.files_processed} files</p>
            <button onClick={resetImport} className="text-xs text-green-700 underline mt-1">Done — upload more</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card-purple"><div className="text-xs opacity-80">You made</div><div className="text-xl font-bold mt-1 font-mono">{fmt(stats?.income || 0)}</div></div>
        <div className="stat-card-light"><div className="text-xs text-muted-foreground">You kept</div><div className="text-xl font-bold mt-1 font-mono text-staxx-mint">{fmt(stats?.profit || 0)}</div></div>
        <div className="stat-card-warn"><div className="text-xs text-staxx-amber">Tax to save</div><div className="text-xl font-bold mt-1 font-mono text-staxx-amber">{fmt(stats?.estTax || 0)}</div></div>
        <div className="stat-card-light"><div className="text-xs text-muted-foreground">Already saved</div><div className="text-xl font-bold mt-1 font-mono text-staxx-coral">{fmt(stats?.taxSaved || 0)}</div></div>
      </div>

      {/* Income Trend Chart */}
      {hasData && trend.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-sm font-semibold text-staxx-indigo mb-3">📈 Income Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trend.map((t) => ({ ...t, income: Math.round(t.income), profit: Math.round(t.profit) }))} barSize={barWidth} maxBarSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} tickFormatter={(v) => fmt(v)} width={60} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e8e0f0", fontSize: 13 }} formatter={(value: any) => fmt(Number(value))} />
              <Bar dataKey="income" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="profit" fill="#34D399" radius={[6, 6, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-sm font-semibold text-staxx-indigo mb-3">🤖 AI Insights</h2>
          {insights.slice(0, 2).map((ins, i) => (
            <div key={i} className="flex items-start gap-2 rounded-xl bg-staxx-purple/5 p-3 text-sm text-staxx-indigo mb-2"><span>💡</span><span>{ins.content}</span></div>
          ))}
        </div>
      )}

      {breakdown.length > 1 && (
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-sm font-semibold text-staxx-indigo mb-3">🍩 By Platform</h2>
          {breakdown.map((p) => (
            <div key={p.name} className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium capitalize w-20">{p.name}</span>
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-staxx-purple" style={{ width: `${p.pct}%` }} /></div>
              <span className="text-sm font-mono text-muted-foreground">{p.pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload History */}
      {uploads.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-sm font-semibold text-staxx-indigo mb-3">📋 Upload History</h2>
          <div className="space-y-1">
            {uploads.slice(0, 8).map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg hover:bg-muted/50 p-2 text-sm group">
                <button onClick={() => { setPreviewUpload(u); setDeleteConfirm(null); }} className="flex items-center gap-2 min-w-0 flex-1 text-left">
                  <span>{u.source_type === "screenshot" ? "📸" : "📄"}</span>
                  <span className="truncate text-staxx-indigo">{u.file_name}</span>
                  <span className="text-xs text-muted-foreground">{u.transaction_count} tx</span>
                </button>
                <span className="text-xs text-muted-foreground mr-2">{u.created_at?.slice(0, 10)}</span>
                <button onClick={() => setDeleteConfirm(u.id)}
                  className="opacity-0 group-hover:opacity-100 text-staxx-coral hover:bg-red-50 rounded-lg p-1 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setPreviewUpload(null); setDeleteConfirm(null); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-staxx-indigo">{previewUpload.file_name}</h3>
              <button onClick={() => { setPreviewUpload(null); setDeleteConfirm(null); }}><X className="h-4 w-4" /></button>
            </div>
            <div className="rounded-xl bg-muted p-8 text-center text-4xl">{previewUpload.source_type === "screenshot" ? "📸" : "📄"}</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Type: <span className="font-medium">{previewUpload.source_type}</span></div>
              <div>Transactions: <span className="font-medium">{previewUpload.transaction_count}</span></div>
              {previewUpload.period_start && <div>From: <span className="font-medium">{previewUpload.period_start?.slice(0, 7)}</span></div>}
              {previewUpload.period_end && <div>To: <span className="font-medium">{previewUpload.period_end?.slice(0, 7)}</span></div>}
            </div>

            {deleteConfirm === previewUpload.id ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-red-700"><AlertTriangle className="h-4 w-4" />Delete this upload and all its {previewUpload.transaction_count} transactions?</div>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteUpload(previewUpload.id)} disabled={deleting}
                    className="flex-1 rounded-lg bg-red-500 text-white py-1.5 text-sm font-semibold">{deleting ? "Deleting..." : "Yes, delete"}</button>
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border py-1.5 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setDeleteConfirm(previewUpload.id)}
                className="w-full rounded-xl border border-red-200 py-2 text-sm text-staxx-coral hover:bg-red-50 transition-colors">
                <Trash2 className="inline h-3 w-3 mr-1" /> Delete this upload
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
