import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://ecekeoqkpppitujyhkud.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mi2LYbMdiEjyRYtyEWSUhg_ooRuTiJn";

export async function createClient(req?: Request) {
  // Try Authorization header first (for API routes)
  let token = "";
  if (req) {
    const auth = req.headers.get("Authorization") || "";
    token = auth.replace("Bearer ", "");
  }

  // Fall back to cookies
  if (!token) {
    try {
      const cookieStore = await cookies();
      const sbCookie = cookieStore.getAll().find((c) =>
        c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
      );
      if (sbCookie) {
        const parsed = JSON.parse(decodeURIComponent(sbCookie.value));
        token = parsed[0] || "";
      }
    } catch {}
  }

  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
