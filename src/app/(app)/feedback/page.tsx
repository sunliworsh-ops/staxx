"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function FeedbackPage() {
  const [type, setType] = useState("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email || "");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 5) { setError("Please write at least a few words."); return; }
    setLoading(true); setError("");
    try {
      const res = await authFetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, page: window.location.pathname, email: email || undefined }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-staxx-mint mx-auto" />
        <h1 className="text-2xl font-bold text-staxx-indigo font-display">Got it — thank you!</h1>
        <p className="text-muted-foreground">Every piece of feedback helps make Staxx better. We read everything.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-staxx-indigo font-display">Feedback</h1>
        <p className="text-sm text-muted-foreground mt-1">Something broken? Have an idea? Tell us anything.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">What is it?</label>
          <div className="flex gap-2 mt-1">
            {[{ value: "bug", label: "🐛 Bug" }, { value: "feature", label: "💡 Suggestion" }, { value: "other", label: "💬 Other" }].map((opt) => (
              <button key={opt.value} type="button" onClick={() => setType(opt.value)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${type === opt.value ? "bg-staxx-purple text-white border-staxx-purple" : "bg-white text-muted-foreground hover:border-staxx-purple"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="msg" className="text-sm font-medium">Your message</label>
          <textarea id="msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what happened, what you expected, and anything else helpful..."
            className="w-full mt-1 rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-staxx-purple/30" required />
        </div>

        <div>
          <label htmlFor="fb-email" className="text-sm font-medium">Email (optional — so we can follow up)</label>
          <input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com" className="w-full mt-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-staxx-purple/30" />
        </div>

        {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

        <Button type="submit" disabled={loading} className="btn-staxx w-full h-11 text-sm">
          {loading ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
    </div>
  );
}
