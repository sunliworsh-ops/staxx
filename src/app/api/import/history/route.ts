import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("transactions")
      .select("period, source_type, platform, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    // Group by import session (same created_at timestamp rounded to minute)
    const sessions = new Map<string, { date: string; type: string; count: number; platforms: Set<string> }>();
    for (const row of data || []) {
      const key = new Date(row.created_at).toISOString().slice(0, 16);
      if (!sessions.has(key)) {
        sessions.set(key, { date: key, type: row.source_type, count: 0, platforms: new Set() });
      }
      const s = sessions.get(key)!;
      s.count++;
      s.platforms.add(row.platform);
    }

    const history = Array.from(sessions.values()).map((s) => ({
      date: s.date,
      type: s.type,
      count: s.count,
      platforms: Array.from(s.platforms),
    }));

    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
