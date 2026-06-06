"use client";

import { useEffect, useState } from "react";
import { FileDown, FileText, Table2 } from "lucide-react";

interface ScheduleC {
  year: number; grossReceipts: number; platformFees: number;
  deductions: Array<{ category: string; amount: number }>;
  totalDeductions: number; netProfit: number; transactionCount: number;
}

export default function ExportPage() {
  const [data, setData] = useState<ScheduleC | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/export/schedule-c").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 0 });

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-staxx-indigo font-display">Tax Export</h1>
        <p className="text-sm text-muted-foreground mt-1">Schedule C data ready for your CPA or TurboTax.</p>
      </div>

      {data ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card-light"><div className="text-xs text-muted-foreground">Gross Receipts</div><div className="text-xl font-bold mt-1 font-mono text-staxx-indigo">{fmt(data.grossReceipts)}</div></div>
            <div className="stat-card-light"><div className="text-xs text-muted-foreground">Platform Fees</div><div className="text-xl font-bold mt-1 font-mono text-staxx-coral">{fmt(data.platformFees)}</div></div>
            <div className="stat-card-light"><div className="text-xs text-muted-foreground">Total Deductions</div><div className="text-xl font-bold mt-1 font-mono text-staxx-mint">{fmt(data.totalDeductions)}</div></div>
            <div className="stat-card-purple"><div className="text-xs opacity-80">Net Profit</div><div className="text-xl font-bold mt-1 font-mono">{fmt(data.netProfit)}</div></div>
          </div>

          {/* Deduction breakdown */}
          {data.deductions.length > 0 && (
            <div className="rounded-2xl border bg-white p-5">
              <h2 className="text-sm font-semibold text-staxx-indigo mb-3">Deductions Breakdown</h2>
              <div className="space-y-2">
                {data.deductions.map((d) => (
                  <div key={d.category} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{d.category.replace(/_/g, " ")}</span>
                    <span className="font-mono text-staxx-indigo">{fmt(d.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export buttons */}
          <div className="space-y-3">
            <a href="/api/export/csv" className="flex items-center gap-3 rounded-xl border bg-white p-4 hover:bg-muted/50 transition-colors no-underline">
              <Table2 className="h-5 w-5 text-staxx-purple" />
              <div><p className="text-sm font-semibold text-staxx-indigo">Download CSV</p><p className="text-xs text-muted-foreground">Import into Excel, Google Sheets, or TurboTax</p></div>
            </a>
            <a href={`/api/export/pdf?t=${Date.now()}`} className="flex items-center gap-3 rounded-xl border bg-white p-4 hover:bg-muted/50 transition-colors no-underline">
              <FileText className="h-5 w-5 text-staxx-purple" />
              <div><p className="text-sm font-semibold text-staxx-indigo">Download PDF Report</p><p className="text-xs text-muted-foreground">Clean summary for your CPA or tax preparer</p></div>
            </a>
            <div className="flex items-center gap-3 rounded-xl border bg-white p-4 opacity-50">
              <FileDown className="h-5 w-5 text-muted-foreground" />
              <div><p className="text-sm font-semibold text-staxx-indigo">TurboTax Import</p><p className="text-xs text-muted-foreground">Coming soon — use CSV for now</p></div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-staxx-purple/30 bg-white p-12 text-center">
          <p className="text-muted-foreground">No data to export yet. Import some earnings first!</p>
        </div>
      )}

      <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 leading-relaxed">
        <strong>⚠️ Staxx provides tax-ready data, not tax advice.</strong> Always review with a licensed CPA before filing with the IRS.
      </div>
    </div>
  );
}
