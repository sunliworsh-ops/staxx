import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 2026 US tax brackets (simplified single filer)
function calcFederalTax(income: number): number {
  const brackets = [
    [0, 11925, 0.10], [11925, 48475, 0.12], [48475, 103350, 0.22],
    [103350, 197300, 0.24], [197300, 250525, 0.32], [250525, 626350, 0.35], [626350, Infinity, 0.37],
  ];
  let tax = 0;
  for (const [min, max, rate] of brackets) {
    if (income > +min) {
      tax += (Math.min(income, +max) - +min) * +rate;
    }
  }
  return tax;
}

function calcSETax(income: number): number {
  // SE tax = 15.3% on 92.35% of income, capped at $176,100 for Social Security portion
  const base = income * 0.9235;
  const ssCap = 176100;
  const ss = Math.min(base, ssCap) * 0.124;
  const medicare = base * 0.029;
  return ss + medicare;
}

const STATE_RATES: Record<string, number> = {
  CA: 0.093, NY: 0.088, TX: 0, FL: 0, WA: 0, NV: 0, IL: 0.0495,
  MA: 0.05, NJ: 0.0637, PA: 0.0307, OH: 0.0275, GA: 0.0549,
  NC: 0.045, MI: 0.0425, VA: 0.0575, AZ: 0.025, CO: 0.044,
  OR: 0.0875, MN: 0.068, WI: 0.053, MD: 0.0475, DC: 0.085,
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const state = user.user_metadata?.state || "CA";
    const now = new Date();
    const yearStart = `${now.getFullYear()}-01-01`;
    const quarter = `2026-Q${Math.ceil((now.getMonth() + 1) / 3)}`;

    // YTD income and expenses
    const { data: tx } = await supabase.from("transactions").select("amount, category").eq("user_id", user.id).gte("period", yearStart);
    const grossIncome = (tx || []).filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = (tx || []).filter((t) => t.amount < 0 && t.category !== "platform_fee").reduce((s, t) => s + Math.abs(t.amount), 0);
    const fees = (tx || []).filter((t) => t.amount < 0 && t.category === "platform_fee").reduce((s, t) => s + Math.abs(t.amount), 0);
    const netIncome = grossIncome - fees - expenses;

    // Annualize for tax calculation
    const monthsPassed = now.getMonth() + 1;
    const annualized = monthsPassed > 0 ? (netIncome / monthsPassed) * 12 : netIncome;
    const federal = calcFederalTax(Math.max(0, annualized));
    const se = calcSETax(Math.max(0, annualized));
    const stateRate = STATE_RATES[state] || 0.05;
    const stateTax = Math.max(0, annualized) * stateRate;
    const totalTax = federal + se + stateTax;
    const quarterlyTax = Math.round((totalTax / 4) * 100) / 100;

    // Check prior estimate
    const { data: prev } = await supabase.from("tax_estimates").select("amount_saved").eq("user_id", user.id).eq("quarter", quarter).maybeSingle();

    const dueDates: Record<string, string> = {
      "2026-Q1": "2026-04-15", "2026-Q2": "2026-06-15", "2026-Q3": "2026-09-15", "2026-Q4": "2027-01-15",
    };

    return NextResponse.json({
      quarter,
      grossIncome: Math.round(grossIncome * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      platformFees: Math.round(fees * 100) / 100,
      netIncome: Math.round(netIncome * 100) / 100,
      annualizedIncome: Math.round(annualized * 100) / 100,
      breakdown: {
        federalTax: Math.round(federal * 100) / 100,
        seTax: Math.round(se * 100) / 100,
        stateTax: Math.round(stateTax * 100) / 100,
        totalAnnual: Math.round(totalTax * 100) / 100,
      },
      quarterlyEstimate: quarterlyTax,
      amountSaved: prev?.amount_saved || 0,
      dueDate: dueDates[quarter] || "TBD",
      state,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
