import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client — works on Vercel without @supabase/ssr cookie helpers.
 * Gets the auth token from the request cookie directly.
 */
export async function createClient() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Build Cookie header from all cookies
    const cookieHeader = allCookies
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: cookieHeader ? { Cookie: cookieHeader } : {},
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  } catch {
    // Fallback: no cookies available (e.g., during static generation)
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );
  }
}
