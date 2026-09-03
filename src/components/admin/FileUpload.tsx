"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  /** Optional manual URL input toggle */
  allowManualUrl?: boolean;
}

export default function FileUpload({
  value,
  onChange,
  label = "Upload image",
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
  maxSizeMB = 5,
  allowManualUrl = true,
}: FileUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">(
    value && !value.startsWith("/uploads/") ? "url" : "upload",
  );
  const [urlInput, setUrlInput] = useState(
    value && !value.startsWith("/uploads/") ? value : "",
  );
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    value && value.startsWith("/uploads/") ? value : null,
  );
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File exceeds ${maxSizeMB}MB limit`);
        return;
      }
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(json.error ?? "Upload failed");
          return;
        }
        setPreview(json.url);
        onChange(json.url);
      } catch {
        setError("Network error during upload");
      } finally {
        setUploading(false);
      }
    },
    [maxSizeMB, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
      // Reset so re-selecting same file triggers onChange
      e.target.value = "";
    },
    [uploadFile],
  );

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      setPreview(null);
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUrlInput("");
    setError("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Mode toggle */}
      {allowManualUrl && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={[
              "rounded-lg px-3 py-1 text-xs font-semibold transition",
              mode === "upload"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
            ].join(" ")}
          >
            Upload file
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={[
              "rounded-lg px-3 py-1 text-xs font-semibold transition",
              mode === "url"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
            ].join(" ")}
          >
            Enter URL
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <>
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={[
              "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition",
              dragging
                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-600 dark:bg-slate-900/50 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20",
            ].join(" ")}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            ) : preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-24 w-auto max-w-full rounded-lg object-contain"
                  onError={() => setPreview(null)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white shadow hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Drag & drop your image here
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  or click to browse · Max {maxSizeMB}MB
                </p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600">{error}</p>
          )}

          {preview && (
            <p className="text-xs text-slate-500 truncate">
              <ImageIcon className="mr-1 inline h-3 w-3" />
              {preview}
            </p>
          )}
        </>
      )}

      {/* URL mode */}
      {mode === "url" && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="/branding/image.jpg or https://..."
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Apply
          </button>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-500 hover:bg-slate-50 transition dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Current value display */}
      {value && mode === "url" && (
        <p className="text-xs text-slate-500 truncate">
          Current: {value}
        </p>
      )}
    </div>
  );
}
