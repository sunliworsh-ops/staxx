import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email, password, state, incomeBracket } = await request.json();
    const url = "https://ecekeoqkpppitujyhkud.supabase.co";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const anonKey = "sb_publishable_mi2LYbMdiEjyRYtyEWSUhg_ooRuTiJn";

    // Admin client for user management
    const adminClient = createClient(url, serviceKey);

    // Create user
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { state, income_bracket: incomeBracket },
    });

    // If already exists, try sign-in anyway
    if (createError && !createError.message?.includes("already been registered")) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // Sign in with anon key to get browser-compatible session
    const browserClient = createClient(url, anonKey);
    // Set 7-day trial
    await adminClient.from("profiles").update({
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subscription_tier: "free",
    }).eq("id", createData?.user?.id || "");

    const { data: loginData, error: loginError } = await browserClient.auth.signInWithPassword({ email, password });

    return NextResponse.json({
      success: true,
      access_token: loginData.session!.access_token,
      refresh_token: loginData.session!.refresh_token,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
