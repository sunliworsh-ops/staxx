import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const { data: existing } = await supabase
      .from("transactions")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only allow updating these fields
    const allowed = ["platform", "category", "amount", "notes"];
    const updates: Record<string, unknown> = { user_corrected: true };
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const { error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
