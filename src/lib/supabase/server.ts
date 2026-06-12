import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://ecekeoqkpppitujyhkud.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mi2LYbMdiEjyRYtyEWSUhg_ooRuTiJn";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function extractToken(req?: Request): string {
  if (req) {
    const auth = req.headers.get("Authorization") || "";
    const token = auth.replace("Bearer ", "");
    if (token) return token;
  }
  return "";
}

function parseUserId(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    return decoded.sub || null;
  } catch { return null; }
}

export async function createClient(req?: Request) {
  const token = extractToken(req);

  // Try token auth first
  if (token) {
    const userId = parseUserId(token);
    if (userId) {
      return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
    }
  }

  // Fallback: try cookies
  let cookieToken = "";
  try {
    const cookieStore = await cookies();
    const sbCookie = cookieStore.getAll().find((c) =>
      c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );
    if (sbCookie) {
      const parsed = JSON.parse(decodeURIComponent(sbCookie.value));
      cookieToken = parsed[0] || "";
    }
  } catch {}

  if (cookieToken) {
    return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${cookieToken}` } },
    });
  }

  // No auth — return anon client (will fail getUser())
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
