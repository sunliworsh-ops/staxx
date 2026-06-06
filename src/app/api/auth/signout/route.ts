import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const SUPABASE_URL = "https://ecekeoqkpppitujyhkud.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mi2LYbMdiEjyRYtyEWSUhg_ooRuTiJn";

export async function POST(request: Request) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/login", "https://staxx-lxyomc0jq-sunliworsh-2428s-projects.vercel.app"));
}
