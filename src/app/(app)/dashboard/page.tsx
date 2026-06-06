import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Upload, TrendingUp, PieChart } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userState = user?.user_metadata?.state ?? "CA";
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // Check if user has any data
  const { count } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const hasData = (count ?? 0) > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-staxx-indigo font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your financial overview — {userState}</p>
        </div>
        {hasData && (
          <Link href="/import" className="btn-staxx inline-flex h-10 px-4 text-sm">
            <Upload className="h-4 w-4" /> Import More
          </Link>
        )}
      </div>

      {!hasData ? (
        /* Empty state */
        <div className="rounded-3xl border-2 border-dashed border-staxx-purple/30 bg-white p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-staxx-purple/10 mb-4">
              <Upload className="h-8 w-8 text-staxx-purple" />
            </div>
            <h2 className="text-xl font-semibold text-staxx-indigo">Ready to see your numbers?</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Upload a screenshot of your OnlyFans earnings or a CSV export.
              Staxx will automatically categorize everything and show you exactly where your money went.
            </p>
            <Link href="/import" className="btn-staxx inline-flex h-11 px-6 mt-6 text-sm">
              <Upload className="h-4 w-4" /> Import your first earnings
            </Link>
          </div>
        </div>
      ) : null}

      {/* Stat cards — always shown, populated if hasData */}
      <DashboardContent hasData={hasData} userId={user!.id} thisMonth={thisMonth} />
    </div>
  );
}

async function DashboardContent({ hasData, userId, thisMonth }: { hasData: boolean; userId: string; thisMonth: string }) {
  const supabase = await createClient();

  // Stats
  const { data: monthTx } = await supabase.from("transactions").select("amount").eq("user_id", userId).eq("period", thisMonth);
  const income = (monthTx || []).filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const fees = (monthTx || []).filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const profit = income - fees;

  // Trend
  const { data: allTx } = await supabase.from("transactions").select("amount, period").eq("user_id", userId).order("period");
  const monthly: Record<string, { income: number; fees: number }> = {};
  for (const tx of allTx || []) {
    const m = tx.period.slice(0, 7);
    if (!monthly[m]) monthly[m] = { income: 0, fees: 0 };
    if (tx.amount > 0) monthly[m].income += tx.amount;
    else monthly[m].fees += Math.abs(tx.amount);
  }
  const trend = Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)).slice(-12);
  const maxIncome = Math.max(1, ...trend.map(([, v]) => v.income));

  // Platform breakdown
  const platforms: Record<string, number> = {};
  for (const tx of monthTx || []) {
    const p = "platform"; // keep it simple
    const platformMap: Record<string, string> = {};
    // Re-fetch with platform
  }
  const { data: platTx } = await supabase.from("transactions").select("platform, amount").eq("user_id", userId).eq("period", thisMonth);
  const platMap: Record<string, number> = {};
  for (const tx of platTx || []) {
    const p = tx.platform || "other";
    platMap[p] = (platMap[p] || 0) + tx.amount;
  }
  const totalPlat = Object.values(platMap).reduce((s, v) => s + Math.abs(v), 0) || 1;
  const breakdown = Object.entries(platMap).map(([name, amount]) => ({
    name,
    amount: Math.round(amount * 100) / 100,
    pct: Math.round((Math.abs(amount) / totalPlat) * 100),
  }));

  const estTax = Math.round(profit * 0.3 * 100) / 100;
  const fmt = (n: number) => "$" + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-purple">
          <div className="text-xs opacity-80">Total Income</div>
          <div className="text-2xl font-bold mt-1 font-mono">{fmt(income)}</div>
          <div className="text-xs opacity-60 mt-1">{hasData ? `from ${monthTx?.length || 0} tx` : "No data yet"}</div>
        </div>
        <div className="stat-card-light">
          <div className="text-xs text-muted-foreground">Net Profit</div>
          <div className="text-2xl font-bold mt-1 font-mono text-staxx-mint">{fmt(profit)}</div>
          <div className="text-xs text-muted-foreground/60 mt-1">fees: {fmt(fees)}</div>
        </div>
        <div className="stat-card-warn">
          <div className="text-xs text-staxx-amber">Est. Tax</div>
          <div className="text-2xl font-bold mt-1 font-mono text-staxx-amber">{fmt(estTax)}</div>
          <div className="text-xs text-staxx-amber/60 mt-1">~30% of profit</div>
        </div>
        <div className="stat-card-light">
          <div className="text-xs text-muted-foreground">Tax Saved</div>
          <div className="text-2xl font-bold mt-1 font-mono text-staxx-coral">$0</div>
          <div className="text-xs text-muted-foreground/60 mt-1">start saving</div>
        </div>
      </div>

      {hasData && trend.length > 0 ? (
        <>
          {/* Income Trend */}
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-staxx-purple" />
              <h2 className="text-sm font-semibold text-staxx-indigo">Income Trend</h2>
            </div>
            <div className="flex items-end gap-1 h-32">
              {trend.map(([month, vals]) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{fmt(vals.income)}</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-staxx-purple to-staxx-pink transition-all"
                    style={{ height: `${Math.max(4, (vals.income / maxIncome) * 100)}%` }} />
                  <span className="text-[10px] text-muted-foreground/60">{month.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Breakdown */}
          {breakdown.length > 1 && (
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-4 w-4 text-staxx-purple" />
                <h2 className="text-sm font-semibold text-staxx-indigo">By Platform</h2>
              </div>
              <div className="space-y-2">
                {breakdown.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-sm font-medium capitalize w-20 text-staxx-indigo">{p.name}</span>
                    <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-staxx-purple" style={{ width: `${p.pct}%` }} />
                    </div>
                    <span className="text-sm font-mono text-muted-foreground w-14 text-right">{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* AI Insights — async fetch from insights table */}
      <InsightCard userId={userId} />

      {/* Recent Transactions */}
      <TransactionList userId={userId} />
    </>
  );
}

async function InsightCard({ userId }: { userId: string }) {
  const supabase = await createClient();
  const { data } = await supabase.from("insights").select("category, content").eq("user_id", userId).order("created_at", { ascending: false }).limit(3);
  if (!data?.length) return null;

  const icons: Record<string, string> = { tax_saving: "💡", spending_alert: "⚠️", trend: "📊", fee_opt: "💰" };

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <span>🤖</span>
        <h2 className="text-sm font-semibold text-staxx-indigo">AI Insights</h2>
      </div>
      <div className="space-y-2">
        {data.map((insight, i) => (
          <div key={i} className="flex items-start gap-2 rounded-xl bg-staxx-purple/5 p-3 text-sm leading-relaxed text-staxx-indigo">
            <span className="text-base shrink-0">{icons[insight.category] || "💡"}</span>
            <span>{insight.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

async function TransactionList({ userId }: { userId: string }) {
  const supabase = await createClient();
  const { data } = await supabase.from("transactions").select("platform, category, amount, period, ai_confidence").eq("user_id", userId).order("period", { ascending: false }).limit(20);
  if (!data?.length) return null;

  const fmt = (n: number) => "$" + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 0 });

  return (
    <div className="rounded-2xl border bg-white p-5">
      <h2 className="text-sm font-semibold text-staxx-indigo mb-3">Recent Transactions</h2>
      <div className="space-y-1">
        {data.map((tx, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg hover:bg-muted/50 p-2 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${tx.amount > 0 ? "bg-staxx-mint" : "bg-staxx-coral"}`} />
              <span className="text-xs text-muted-foreground capitalize w-14 shrink-0">{tx.platform}</span>
              <span className="text-xs text-staxx-indigo capitalize truncate">{tx.category.replace(/_/g, " ")}</span>
              {tx.ai_confidence && tx.ai_confidence < 0.8 && <span className="text-[10px] text-amber-500">⚠️</span>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{tx.period?.slice(0, 7)}</span>
              <span className={`text-sm font-mono font-semibold ${tx.amount > 0 ? "text-staxx-mint" : "text-staxx-coral"}`}>
                {tx.amount > 0 ? "+" : "-"}{fmt(tx.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
