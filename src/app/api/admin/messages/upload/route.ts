import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/admin/supabase";
import { requireAdmin } from "@/lib/admin/auth-guard";
import { uploadBytes } from "@/lib/storage/cloudinary";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const form = await request.formData();
  const file = form.get("file");
  const messageId = form.get("message_id");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!messageId || typeof messageId !== "string") {
    return NextResponse.json(
      { error: "message_id is required" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 5MB limit" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  // Ensure message exists and caller is participant
  const { data: message } = await supabase
    .from("lifelink_messages")
    .select("id, sender_id")
    .eq("id", messageId)
    .maybeSingle();
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();

  let uploaded: { url: string; publicId: string; bytes: number };
  try {
    uploaded = await uploadBytes(bytes, {
      folder: `lifelink/messages/${messageId}`,
      resourceType: "auto",
      maxBytes: MAX_SIZE,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: attachment, error: attErr } = await supabase
    .from("lifelink_message_attachments")
    .insert({
      message_id: messageId,
      file_url: uploaded.url,
      file_name: file.name,
      file_type: file.type,
      file_size: uploaded.bytes,
    })
    .select()
    .single();

  if (attErr || !attachment) {
    return NextResponse.json(
      { error: attErr?.message ?? "Failed to save attachment" },
      { status: 500 },
    );
  }

  return NextResponse.json({ attachment }, { status: 201 });
}
