"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const INCOME_BRACKETS = [
  { label: "Under $1,000 / month", value: "under_1k" },
  { label: "$1,000 – $3,000 / month", value: "1k_3k" },
  { label: "$3,000 – $10,000 / month", value: "3k_10k" },
  { label: "$10,000 – $30,000 / month", value: "10k_30k" },
  { label: "$30,000 – $50,000 / month", value: "30k_50k" },
  { label: "Over $50,000 / month", value: "over_50k" },
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [incomeBracket, setIncomeBracket] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!state || !incomeBracket) {
      setError("Please select your state and income range.");
      setLoading(false);
      return;
    }

    // Step 1: Create user via admin API (no email confirmation needed)
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, state, incomeBracket }),
    });
    const result = await res.json();
    if (!res.ok || result.error) {
      setError(result.error || "Signup failed");
      setLoading(false);
      return;
    }

    // Step 2: Set session from server response, or redirect to login
    if (result.access_token) {
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
      router.push("/dashboard");
    } else {
      router.push("/login?msg=account_created");
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-staxx-indigo">
          Start stacking
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          No real name needed. Just an email to keep your data safe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="state" className="text-sm font-medium">
            Your state (for tax estimates)
          </label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="flex h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select your state...</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="income" className="text-sm font-medium">
            Monthly income (range)
          </label>
          <select
            id="income"
            value={incomeBracket}
            onChange={(e) => setIncomeBracket(e.target.value)}
            required
            className="flex h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select range...</option>
            {INCOME_BRACKETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="btn-staxx w-full h-11"
        >
          {loading ? "Creating account..." : "Create Free Account"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        By signing up, you agree to our Terms of Service and Privacy Policy.
        Staxx provides financial data, not tax advice. Always review with a CPA.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-staxx-purple hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
