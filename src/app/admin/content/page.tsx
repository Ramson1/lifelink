"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Loader2,
  Save,
  CheckCircle2,
  Search,
  Trash2,
} from "lucide-react";

import {
  CONTENT_KEYS,
  CONTENT_SECTIONS,
  type ContentKey,
} from "@/lib/admin/content-keys";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

interface ContentItem {
  key: string;
  value: string;
  updated_at: string | null;
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("All");
  const { showToast, confirm, Alerts } = useAdminAlerts();
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const { canCrud } = useAdminPermissions();

  // Local draft values keyed by content key
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/content");
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(json.error ?? "Failed to load content");
          return;
        }
        const list: ContentItem[] = json.items ?? [];
        setItems(list);
        const initial: Record<string, string> = {};
        for (const def of CONTENT_KEYS) {
          const found = list.find((i) => i.key === def.key);
          initial[def.key] = found?.value ?? "";
        }
        setDrafts(initial);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONTENT_KEYS.filter((k) => {
      if (activeSection !== "All" && k.section !== activeSection) return false;
      if (!q) return true;
      return (
        k.label.toLowerCase().includes(q) ||
        k.key.toLowerCase().includes(q) ||
        (k.helper ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, activeSection]);

  const grouped = useMemo(() => {
    const map: Record<string, ContentKey[]> = {};
    for (const k of filtered) {
      (map[k.section] ??= []).push(k);
    }
    return map;
  }, [filtered]);

  const save = async (def: ContentKey) => {
    setSavingKey(def.key);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${encodeURIComponent(def.key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: drafts[def.key] ?? "" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Failed to save");
        return;
      }
      showToast("success", `"${def.label}" saved successfully`);
      setSavedKeys((prev) => new Set(prev).add(def.key));
      setTimeout(() => {
        setSavedKeys((prev) => {
          const next = new Set(prev);
          next.delete(def.key);
          return next;
        });
      }, 2000);
    } catch {
      showToast("error", "Network error");
    } finally {
      setSavingKey(null);
    }
  };

  const deleteContent = (def: ContentKey) => {
    confirm(
      "Delete content",
      `Are you sure you want to delete "${def.label}"? The website will fall back to the default value.`,
      async () => {
        setDeletingKey(def.key);
        try {
          const res = await fetch(
            `/api/admin/content/${encodeURIComponent(def.key)}`,
            { method: "DELETE" },
          );
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            showToast("error", json.error ?? "Failed to delete");
            return;
          }
          setDrafts((d) => ({ ...d, [def.key]: "" }));
          showToast("success", `"${def.label}" deleted — default value will be shown`);
        } catch {
          showToast("error", "Network error");
        } finally {
          setDeletingKey(null);
        }
      },
    );
  };

  return (
    <div className="space-y-6">
      <Alerts />
      <header>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Website
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Content
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Edit the text that appears on the public website.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search content"
            className="h-9 w-64 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {["All", ...CONTENT_SECTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                activeSection === s
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([section, keys]) => (
            <section
              key={section}
              className="rounded-3xl border border-slate-200 bg-white"
            >
              <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
                <FileText className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  {section}
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {keys.map((def) => {
                  const saving = savingKey === def.key;
                  const saved = savedKeys.has(def.key);
                  return (
                    <div key={def.key} className="px-6 py-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900">
                            {def.label}
                          </div>
                          {def.helper && (
                            <div className="mt-0.5 text-xs text-slate-500">
                              {def.helper}
                            </div>
                          )}
                          <div className="mt-1 font-mono text-[10px] text-slate-400">
                            {def.key}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {canCrud && (
                            <button
                              onClick={() => deleteContent(def)}
                              disabled={deletingKey === def.key}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                            >
                              {deletingKey === def.key ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              Delete
                            </button>
                          )}
                          {canCrud && (
                            <button
                              onClick={() => save(def)}
                              disabled={saving}
                              className={[
                                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition",
                                saved
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60",
                              ].join(" ")}
                            >
                              {saving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : saved ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <Save className="h-3.5 w-3.5" />
                              )}
                              {saving ? "Saving" : saved ? "Saved" : "Save"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        {def.type === "textarea" || def.type === "richtext" ? (
                          <textarea
                            rows={4}
                            value={drafts[def.key] ?? ""}
                            onChange={(e) =>
                              setDrafts((d) => ({
                                ...d,
                                [def.key]: e.target.value,
                              }))
                            }
                            readOnly={!canCrud}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                          />
                        ) : (
                          <input
                            value={drafts[def.key] ?? ""}
                            onChange={(e) =>
                              setDrafts((d) => ({
                                ...d,
                                [def.key]: e.target.value,
                              }))
                            }
                            readOnly={!canCrud}
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
