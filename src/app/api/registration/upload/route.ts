import { NextResponse } from "next/server";

import { uploadBytes } from "@/lib/storage/cloudinary";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 2MB limit" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPG, PNG, WebP" },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();

  try {
    const result = await uploadBytes(bytes, {
      folder: "lifelink/passports",
      resourceType: "image",
      maxBytes: MAX_SIZE,
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
