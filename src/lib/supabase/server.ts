import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://ecekeoqkpppitujyhkud.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mi2LYbMdiEjyRYtyEWSUhg_ooRuTiJn";

export async function createClient() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

    return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: cookieHeader ? { Cookie: cookieHeader } : {} },
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
}
