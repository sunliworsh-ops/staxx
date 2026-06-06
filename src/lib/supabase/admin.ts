import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ecekeoqkpppitujyhkud.supabase.co";

export function createAdminClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
