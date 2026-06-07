import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { type, message, page, email } = await request.json();
    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Message too short" }, { status: 400 });
    }

    const supabase = await createClient(request);

    // Try to get user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedback").insert({
      user_id: user?.id || null,
      email: email || user?.email || null,
      type: type || "bug",
      message: message.trim(),
      page: page || null,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
