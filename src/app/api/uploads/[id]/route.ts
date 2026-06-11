import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Get upload info first
    const { data: upload } = await supabase.from("uploads").select("*").eq("id", id).eq("user_id", user.id).single();
    if (!upload) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete associated transactions (close to upload time, same user)
    const uploadTime = new Date(upload.created_at);
    const windowStart = new Date(uploadTime.getTime() - 60000).toISOString();
    const windowEnd = new Date(uploadTime.getTime() + 60000).toISOString();

    await supabase.from("transactions").delete()
      .eq("user_id", user.id)
      .gte("created_at", windowStart)
      .lte("created_at", windowEnd);

    // Delete the upload record
    await supabase.from("uploads").delete().eq("id", id).eq("user_id", user.id);

    return NextResponse.json({ success: true, transactions_removed: upload.transaction_count });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
