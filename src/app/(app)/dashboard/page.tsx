"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload, TrendingUp, PieChart } from "lucide-react";

interface Stats { income: number; profit: number; estTax: number; taxSaved: number; transactionCount: number; }
interface TrendItem { month: string; income: number; profit: number; }
interface BreakdownItem { name: string; amount: number; pct: number; }
interface Insight { category: string; content: string; }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((r) => r.json()),
      fetch("/api/dashboard/trend").then((r) => r.json()),
      fetch("/api/dashboard/breakdown").then((r) => r.json()),
      fetch("/api/ai/insights").then((r) => r.json()),
    ]).then(([s, t, b, i]) => {
      setStats(s);
      setTrend(t.trend || []);
      setBreakdown(b.breakdown || []);
      setInsights(i.insights || []);
      setLoading(false);
    });
  }, []);

  const fmt = (n: number) => "$" + (n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 });
  const hasData = stats && stats.transactionCount > 0;
  const maxIncome = Math.max(1, ...trend.map((t) => t.income));

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading your dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-staxx-indigo font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your financial overview</p>
        </div>
        {hasData && <Link href="/import" className="btn-staxx inline-flex h-10 px-4 text-sm"><Upload className="h-4 w-4" /> Import More</Link>}
      </div>

      {!hasData ? (
        <div className="rounded-3xl border-2 border-dashed border-staxx-purple/30 bg-white p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-staxx-purple/10 mb-4"><Upload className="h-8 w-8 text-staxx-purple" /></div>
            <h2 className="text-xl font-semibold text-staxx-indigo">Ready to see your numbers?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Upload a screenshot or CSV. Staxx does the rest.</p>
            <Link href="/import" className="btn-staxx inline-flex h-11 px-6 mt-6 text-sm"><Upload className="h-4 w-4" /> Import your first earnings</Link>
          </div>
        </div>
      ) : null}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card-purple"><div className="text-xs opacity-80">Total Income</div><div className="text-2xl font-bold mt-1 font-mono">{fmt(stats.income)}</div></div>
          <div className="stat-card-light"><div className="text-xs text-muted-foreground">Net Profit</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-mint">{fmt(stats.profit)}</div></div>
          <div className="stat-card-warn"><div className="text-xs text-staxx-amber">Est. Tax</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-amber">{fmt(stats.estTax)}</div></div>
          <div className="stat-card-light"><div className="text-xs text-muted-foreground">Tax Saved</div><div className="text-2xl font-bold mt-1 font-mono text-staxx-coral">{fmt(stats.taxSaved)}</div></div>
        </div>
      )}

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
          <div className="space-y-2">
            {breakdown.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-sm font-medium capitalize w-20 text-staxx-indigo">{p.name}</span>
                <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-staxx-purple" style={{ width: `${p.pct}%` }} /></div>
                <span className="text-sm font-mono text-muted-foreground w-14 text-right">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div className="rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-2 mb-3"><span>🤖</span><h2 className="text-sm font-semibold text-staxx-indigo">AI Insights</h2></div>
          <div className="space-y-2">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl bg-staxx-purple/5 p-3 text-sm text-staxx-indigo"><span>💡</span><span>{ins.content}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
