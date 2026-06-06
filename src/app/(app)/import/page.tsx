"use client";

import { useState, useCallback, useEffect, type DragEvent } from "react";
import { UploadCloud, Camera, FileText, ArrowRight, CheckCircle2, Loader2, X, History } from "lucide-react";
import { authFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Step = "upload" | "uploading" | "analyzing" | "done";

interface TransactionItem {
  id?: string;
  platform: string;
  category: string;
  amount: number;
  confidence: number;
}
interface Result {
  transactions: TransactionItem[];
  unrecognized: Array<{ text: string; amount: number }>;
  total_income: number;
  total_fees: number;
  duplicates_skipped?: number;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ platform: "", category: "", amount: "" });
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [history, setHistory] = useState<Array<{ date: string; type: string; count: number; platforms: string[] }>>([]);
  const router = useRouter();

  const handleEdit = (tx: TransactionItem, idx: number) => {
    setEditingId(idx);
    setEditValues({ platform: tx.platform, category: tx.category, amount: String(tx.amount) });
  };

  const handleSave = async (tx: TransactionItem, idx: number) => {
    setSaving(true);
    const updated = {
      ...tx,
      platform: editValues.platform,
      category: editValues.category,
      amount: parseFloat(editValues.amount) || tx.amount,
    };
    // Update local state
    if (result) {
      const newTx = [...result.transactions];
      newTx[idx] = updated;
      setResult({
        ...result,
        transactions: newTx,
        total_income: newTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
        total_fees: newTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
      });
    }
    setEditingId(null);
    setSaving(false);
  };

  useEffect(() => {
    authFetch("/api/import/history")
      .then((r) => r.json())
      .then((d) => setHistory(d.history || []))
      .catch(() => {});
  }, [step]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setError("");
    setStep("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Determine endpoint based on file type
      const isImage = file.type.startsWith("image/");
      const endpoint = isImage ? "/api/import/screenshot" : "/api/import/csv";

      setStep("analyzing");
      const res = await authFetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Import failed");
      }

      const data: Result = await res.json();
      setResult(data);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("upload");
    }
  }, [file]);

  const resetImport = useCallback(() => {
    setFile(null);
    setStep("upload");
    setResult(null);
    setError("");
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-staxx-indigo font-display">Import</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a screenshot or CSV from OnlyFans, Patreon, or any platform. AI does the rest.
        </p>
      </div>

      {/* Upload zone */}
      {step === "upload" && (
        <>
          <div
            className={`upload-zone ${dragOver ? "border-staxx-purple bg-staxx-purple/5" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            {!file ? (
              <>
                <UploadCloud className="h-14 w-14 text-staxx-purple/60 mb-4" />
                <p className="text-lg font-semibold text-staxx-indigo">Drop your data here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Screenshot, photo, or CSV — we&apos;ll figure it out
                </p>
                <div className="mt-5 flex items-center gap-5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Camera className="h-4 w-4" /> Screenshot
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="h-4 w-4" /> CSV export
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 w-full max-w-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border">
                  {file.type.startsWith("image/") ? (
                    <Camera className="h-6 w-6 text-staxx-purple" />
                  ) : (
                    <FileText className="h-6 w-6 text-staxx-purple" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-staxx-indigo truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept="image/*,.csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {file && (
            <Button onClick={handleAnalyze} className="btn-staxx w-full h-12 text-sm">
              Analyze
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              <strong>💡 How to export from OnlyFans:</strong> Settings → Payments → Export CSV.
              <br />
              Or just take a screenshot of your earnings dashboard and upload it here.
            </p>
          </div>
        </>
      )}

      {/* Processing */}
      {step === "uploading" || step === "analyzing" ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          <Loader2 className="h-10 w-10 text-staxx-purple animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-staxx-indigo">
            {step === "uploading" ? "Uploading your data..." : "AI is reading your numbers..."}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {step === "uploading"
              ? "Saving to secure storage"
              : "Extracting income, fees, and categories"}
          </p>
        </div>
      ) : null}

      {/* Results */}
      {step === "done" && result && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-semibold text-green-800">
              AI found ${result.total_income.toLocaleString()} across {result.transactions.length} transactions
            </p>
            <p className="text-sm text-green-600 mt-1">
              Platform fees: ${result.total_fees.toLocaleString()}
              {result.duplicates_skipped ? ` · ${result.duplicates_skipped} duplicates skipped` : ""}
            </p>
          </div>

          {/* Transaction cards — editable */}
          <p className="text-sm font-medium text-staxx-indigo mt-4">
            📋 {result.transactions.length} transactions found — tap any to edit
          </p>
          <div className="space-y-2">
            {result.transactions.map((t, i) => (
              <div key={i} className="rounded-xl border bg-white">
                {editingId === i ? (
                  /* Edit mode */
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Platform</label>
                        <select value={editValues.platform} onChange={(e) => setEditValues({ ...editValues, platform: e.target.value })}
                          className="w-full mt-1 rounded-lg border px-2 py-1.5 text-sm">
                          <option value="onlyfans">OnlyFans</option><option value="patreon">Patreon</option>
                          <option value="fansly">Fansly</option><option value="cashapp">CashApp</option>
                          <option value="venmo">Venmo</option><option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Category</label>
                        <select value={editValues.category} onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                          className="w-full mt-1 rounded-lg border px-2 py-1.5 text-sm">
                          <option value="subscription">Subscription</option><option value="ppv">PPV</option>
                          <option value="tip">Tip</option><option value="platform_fee">Platform Fee</option>
                          <option value="referral">Referral</option><option value="other_income">Other Income</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Amount</label>
                        <input type="number" step="0.01" value={editValues.amount}
                          onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                          className="w-full mt-1 rounded-lg border px-2 py-1.5 text-sm font-mono" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(t, i)} disabled={saving}
                        className="flex-1 rounded-lg bg-staxx-mint px-3 py-1.5 text-sm font-semibold text-white">
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditingId(null)}
                        className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleEdit(t, i)}>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                        t.confidence > 0.9 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>{t.confidence > 0.9 ? "✓" : "?"}</span>
                      <div>
                        <p className="text-sm font-semibold text-staxx-indigo capitalize">{t.category.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground capitalize">{t.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold font-mono ${t.amount < 0 ? "text-staxx-coral" : "text-staxx-mint"}`}>
                        {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">✏️</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {result.unrecognized.length > 0 && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm font-semibold text-amber-800 mb-2">
                ⚠️ {result.unrecognized.length} item(s) couldn&apos;t be classified:
              </p>
              {result.unrecognized.map((u, i) => (
                <p key={i} className="text-sm text-amber-700">
                  ${u.amount.toLocaleString()} — {u.text}
                </p>
              ))}
            </div>
          )}

          {!confirmed ? (
            <Button onClick={() => setConfirmed(true)} className="btn-staxx w-full h-12 text-sm">
              ✅ Looks Good — Confirm All
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-center text-sm text-green-600">✓ All {result.transactions.length} transactions confirmed!</p>
              <div className="flex gap-3">
                <Button onClick={resetImport} variant="outline" className="flex-1 h-11 rounded-xl">
                  Import Another
                </Button>
                <Button onClick={() => router.push("/dashboard")} className="btn-staxx flex-1 h-11 text-sm">
                  View Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import History */}
      {history.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-staxx-indigo">Import History</h2>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border bg-white p-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-staxx-purple/10 text-xs">
                    {h.type === "screenshot" ? <Camera className="h-4 w-4 text-staxx-purple" /> : <FileText className="h-4 w-4 text-staxx-purple" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-staxx-indigo">{h.count} transactions</p>
                    <p className="text-xs text-muted-foreground">{h.platforms.join(", ")}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
