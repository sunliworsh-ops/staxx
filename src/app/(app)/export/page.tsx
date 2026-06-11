"use client";

import { useEffect, useState } from "react";
import { FileText, Table2, FileDown } from "lucide-react";
import { authFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

interface ScheduleC {
  year: number; grossReceipts: number; platformFees: number;
  deductions: Array<{ category: string; amount: number }>;
  totalDeductions: number; netProfit: number; transactionCount: number;
}

export default function ExportPage() {
  const [data, setData] = useState<ScheduleC | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("/api/export/schedule-c").then(async (r) => {
      if (!r.ok) throw new Error("Failed to load data");
      return r.json();
    }).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const handleCSVDownload = async () => {
    try {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) { setError("Please sign in first"); return; }

      const res = await fetch("/api/export/csv", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `staxx-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e) { setError("Download failed. Try again."); }
  };

  const fmt = (n: number) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 0 });

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  if (error) return <div className="text-center py-12 text-staxx-coral">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-staxx-indigo font-display">Tax Export</h1>
        <p className="text-sm text-muted-foreground mt-1">Schedule C data ready for your CPA or TurboTax.</p>
      </div>

      {data ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="stat-card-light"><div className="text-xs text-muted-foreground">Gross Receipts</div><div className="text-xl font-bold mt-1 font-mono">{fmt(data.grossReceipts)}</div></div>
            <div className="stat-card-light"><div className="text-xs text-muted-foreground">Platform Fees</div><div className="text-xl font-bold mt-1 font-mono text-staxx-coral">{fmt(data.platformFees)}</div></div>
            <div className="stat-card-light"><div className="text-xs text-muted-foreground">Deductions</div><div className="text-xl font-bold mt-1 font-mono text-staxx-mint">{fmt(data.totalDeductions)}</div></div>
            <div className="stat-card-purple"><div className="text-xs opacity-80">Net Profit</div><div className="text-xl font-bold mt-1 font-mono">{fmt(data.netProfit)}</div></div>
          </div>

          {data.deductions.length > 0 && (
            <div className="rounded-2xl border bg-white p-5">
              <h2 className="text-sm font-semibold text-staxx-indigo mb-3">Deduction Details</h2>
              {data.deductions.map((d) => (
                <div key={d.category} className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground capitalize">{d.category.replace(/_/g, " ")}</span>
                  <span className="font-mono text-staxx-indigo">{fmt(d.amount)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <button onClick={handleCSVDownload}
              className="flex items-center gap-3 w-full rounded-xl border bg-white p-4 hover:bg-muted/50 transition-colors text-left">
              <Table2 className="h-5 w-5 text-staxx-purple shrink-0" />
              <div><p className="text-sm font-semibold text-staxx-indigo">Download CSV</p><p className="text-xs text-muted-foreground">Import into Excel, Google Sheets, or TurboTax</p></div>
            </button>
            <div className="flex items-center gap-3 rounded-xl border bg-white p-4 opacity-50">
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <div><p className="text-sm font-semibold text-staxx-indigo">PDF Report</p><p className="text-xs text-muted-foreground">Coming soon — use CSV for now</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-white p-4 opacity-50">
              <FileDown className="h-5 w-5 text-muted-foreground shrink-0" />
              <div><p className="text-sm font-semibold text-staxx-indigo">TurboTax Import</p><p className="text-xs text-muted-foreground">Coming soon — use CSV for now</p></div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-staxx-purple/30 bg-white p-12 text-center">
          <p className="text-muted-foreground">No data to export yet. Upload some earnings first!</p>
        </div>
      )}

      <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        <strong>⚠️ Staxx provides tax-ready data, not tax advice.</strong> Always review with a CPA before filing.
      </div>
    </div>
  );
}
