// Centralised Cloudinary configuration + upload helper.
//
// Every file-upload route in the app funnels through `uploadBytes()` so we
// have one place to configure credentials, folders, and error handling.
//
// Required environment variables (read from process.env at request time):
//   CLOUDINARY_CLOUD_NAME
//   CLOUDINARY_API_KEY
//   CLOUDINARY_API_SECRET
//
// Missing vars throw a clear runtime error so misconfig is obvious in logs
// instead of silently falling back to disk.
import cloudinary from "cloudinary";

type ResourceType = "image" | "video" | "raw";

type UploadOptions = {
  /** Cloudinary folder prefix, e.g. "lifelink/passports". */
  folder: string;
  /** Optional stable public id (without extension). Auto-generated if omitted. */
  publicId?: string;
  /** Cloudinary resource type. Defaults to "auto" so images + videos work. */
  resourceType?: ResourceType | "auto";
  /** Optional hard cap enforced before we hit Cloudinary. */
  maxBytes?: number;
};

type UploadResult = {
  /** Absolute HTTPS URL safe to store in DB columns / <img src>. */
  url: string;
  /** Cloudinary public_id — useful if you later want to destroy() the asset. */
  publicId: string;
  /** Bytes Cloudinary reports for the stored asset. */
  bytes: number;
  /** "image" | "video" | "raw" as reported by Cloudinary. */
  resourceType: string;
};

function readConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local.",
    );
  }
  return { cloud_name, api_key, api_secret };
}

/** Upload an in-memory buffer to Cloudinary using the v2 Node SDK. */
export async function uploadBytes(
  data: ArrayBuffer | Buffer,
  opts: UploadOptions,
): Promise<UploadResult> {
  const { cloud_name, api_key, api_secret } = readConfig();
  cloudinary.v2.config({ cloud_name, api_key, api_secret, secure: true });

  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
  if (opts.maxBytes && buffer.byteLength > opts.maxBytes) {
    throw new Error(
      `File exceeds ${Math.round(opts.maxBytes / (1024 * 1024))}MB limit`,
    );
  }

  return new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: opts.folder,
        public_id: opts.publicId,
        resource_type: opts.resourceType ?? "auto",
        // Overwrite any existing asset with the same public_id so retries
        // don't leave duplicates. Cloudinary's default is true, we pin it.
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          // Cloudinary delivers either an Error or a plain { message, error } object.
          const details =
            (error as { message?: string })?.message ?? String(error);
          console.error("[cloudinary] upload_stream failed:", error);
          return reject(new Error(details));
        }
        if (!result?.secure_url) {
          return reject(new Error("Cloudinary returned no secure_url"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes ?? buffer.byteLength,
          resourceType: result.resource_type ?? String(opts.resourceType ?? "file"),
        });
      },
    );
    stream.end(buffer);
  });
}

/**
 * Destroy a previously uploaded asset by public_id. Used if we later add
 * remove/replacement flows in the admin dashboard.
 */
export async function destroyAsset(
  publicId: string,
  resourceType: ResourceType | "auto" = "auto",
): Promise<void> {
  const { cloud_name, api_key, api_secret } = readConfig();
  cloudinary.v2.config({ cloud_name, api_key, api_secret, secure: true });
  await cloudinary.v2.uploader.destroy(publicId, { resource_type: resourceType });
}
