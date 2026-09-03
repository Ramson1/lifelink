"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollText,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface AuditEntry {
  id: string;
  admin_id: string | null;
  admin_email: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

const ACTIONS = [
  "admin.login",
  "admin.logout",
  "admin.create",
  "admin.update",
  "admin.delete",
  "admin.password_change",
  "user.create",
  "user.update",
  "user.delete",
  "user.notify",
  "content.update",
  "message.create",
  "message.update",
  "message.delete",
  "notification.create",
  "notification.send",
];

const ENTITY_TYPES = ["admin", "user", "content", "message", "notification"];

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const pageSize = 50;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (query.trim()) params.set("q", query.trim());
      if (actionFilter) params.set("action", actionFilter);
      if (entityFilter) params.set("entity_type", entityFilter);
      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to load audit log");
        return;
      }
      setEntries(json.entries ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [page, query, actionFilter, entityFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const actionColor = (action: string) => {
    if (action.includes("delete")) return "bg-red-50 text-red-700 border-red-200";
    if (action.includes("create")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (action.includes("update")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (action.includes("login")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (action.includes("send")) return "bg-cyan-50 text-cyan-700 border-cyan-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Governance
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Audit Logs
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          A complete record of every admin action in the system.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <ScrollText className="h-4 w-4 text-slate-500" />
            {total} entr{total === 1 ? "y" : "ies"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search logs"
                className="h-9 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 dark:border-slate-600 dark:bg-slate-800">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8 border-0 bg-transparent text-sm outline-none"
              >
                <option value="">All actions</option>
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="">All entity types</option>
              {ENTITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : entries.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            No audit entries found.
          </div>
        ) : (
          <>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {entries.map((e) => (
                <li key={e.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-semibold",
                            actionColor(e.action),
                          ].join(" ")}
                        >
                          {e.action}
                        </span>
                        {e.entity_type && (
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {e.entity_type}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-300">
                          {e.admin_email}
                        </span>
                        {e.entity_id && (
                          <span className="ml-2 font-mono text-[10px] text-slate-400">
                            {e.entity_id}
                          </span>
                        )}
                      </div>
                      {Object.keys(e.details ?? {}).length > 0 && (
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-2 text-[10px] leading-relaxed text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                          {JSON.stringify(e.details, null, 2)}
                        </pre>
                      )}
                    </div>
                    <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                      <div>{new Date(e.created_at).toLocaleString()}</div>
                      {e.ip_address && (
                        <div className="mt-1 font-mono text-[10px] text-slate-400">
                          {e.ip_address}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 text-sm dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
