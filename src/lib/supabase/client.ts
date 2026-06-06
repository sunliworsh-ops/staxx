import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ecekeoqkpppitujyhkud.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mi2LYbMdiEjyRYtyEWSUhg_ooRuTiJn";

export function createClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
