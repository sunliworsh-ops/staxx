import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Verify upload belongs to user
    const { data: upload } = await supabase.from("uploads").select("id, transaction_count").eq("id", id).eq("user_id", user.id).single();
    if (!upload) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete transactions by upload_id (new data) + orphaned fallback
    const { data: linked } = await supabase.from("transactions").select("id").eq("upload_id", id);
    if (linked && linked.length > 0) {
      await supabase.from("transactions").delete().eq("upload_id", id);
    }

    // Delete the upload record
    await supabase.from("uploads").delete().eq("id", id).eq("user_id", user.id);

    return NextResponse.json({ success: true, removed: linked?.length || 0 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
