import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB for passport photos
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "passports");

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

  // Ensure upload directory exists
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") ?? "jpg";
  const uniqueName = `passport-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  const publicUrl = `/uploads/passports/${uniqueName}`;

  return NextResponse.json(
    { url: publicUrl, name: uniqueName, size: file.size },
    { status: 201 },
  );
}
