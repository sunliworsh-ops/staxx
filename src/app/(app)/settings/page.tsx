"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || "");
        setState(user.user_metadata?.state || "");
      }
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-staxx-indigo font-display">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Your account</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <p className="text-sm font-medium text-staxx-indigo">{email || "—"}</p>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">State (for tax estimates)</label>
          <p className="text-sm font-medium text-staxx-indigo">{state || "—"}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <p className="text-sm text-staxx-indigo mb-3">Account</p>
        <Button onClick={handleSignOut} variant="outline" className="w-full h-11 rounded-xl text-staxx-coral hover:text-staxx-coral hover:bg-red-50">
          Sign Out
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Need to delete your account? Email us at hello@staxx.app
      </p>
    </div>
  );
}
