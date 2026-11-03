import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth-guard";
import { uploadBytes } from "@/lib/storage/cloudinary";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB images
const MAX_VIDEO_SIZE = 40 * 1024 * 1024; // 40MB videos
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const form = await request.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  const limit = isVideo ? MAX_VIDEO_SIZE : MAX_SIZE;
  if (file.size > limit) {
    return NextResponse.json(
      { error: isVideo ? "Video exceeds 40MB limit" : "File exceeds 5MB limit" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type) && !isVideo) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV" },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();

  try {
    const result = await uploadBytes(bytes, {
      folder: "lifelink/admin",
      resourceType: isVideo ? "video" : "image",
      maxBytes: limit,
    });
    return NextResponse.json(
      {
        url: result.url,
        name: result.publicId,
        size: result.bytes,
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
