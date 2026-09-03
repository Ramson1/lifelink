"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  DatabaseBackup,
  Download,
  Upload,
  Loader2,
  ShieldAlert,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

interface EntityInfo {
  table: string;
  label: string;
  sensitive: boolean;
  count: number;
  error: string | null;
}

interface RowError {
  row: number;
  message: string;
}

interface EntityResult {
  table: string;
  valid: number;
  inserted: number;
  skipped: number;
  errors: RowError[];
}

interface ImportReport {
  dryRun: boolean;
  mode: "skip" | "update";
  entities: EntityResult[];
  totals: { valid: number; inserted: number; skipped: number; errors: number };
}

export default function BackupPage() {
  const { loaded, canCrud } = useAdminPermissions();

  const [entities, setEntities] = useState<EntityInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [mode, setMode] = useState<"skip" | "update">("skip");
  const [dryRun, setDryRun] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loaded || !canCrud) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/admin/backup/entities");
        if (!res.ok) throw new Error("Failed to load entities");
        const json = await res.json();
        const items: EntityInfo[] = json.entities;
        setEntities(items);
        setSelected(new Set(items.map((i) => i.table)));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [loaded, canCrud]);

  const toggle = (table: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(table)) next.delete(table);
      else next.add(table);
      return next;
    });
  };

  const allSelected = entities.length > 0 && selected.size === entities.length;
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(entities.map((e) => e.table)));

  const triggerDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const exportBundle = () => {
    if (selected.size === 0) return;
    setExporting(true);
    const params = new URLSearchParams({
      format: "bundle",
      entities: Array.from(selected).join(","),
    });
    triggerDownload(`/api/admin/backup/export?${params.toString()}`);
    // The download is a navigation; give the audit write a moment then reset.
    setTimeout(() => setExporting(false), 1500);
  };

  const exportEntityCsv = (table: string) => {
    const params = new URLSearchParams({ format: "csv", entities: table });
    triggerDownload(`/api/admin/backup/export?${params.toString()}`);
  };

  const handleImport = async () => {
    const files = fileRef.current?.files;
    if (!files || files.length === 0) {
      setError("Choose at least one backup file to import.");
      return;
    }
    setImporting(true);
    setError(null);
    setReport(null);
    try {
      const fd = new FormData();
      for (const f of Array.from(files)) fd.append("files", f);
      fd.append("mode", mode);
      fd.append("dryRun", String(dryRun));

      const res = await fetch("/api/admin/backup/import", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      setReport(json as ImportReport);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setImporting(false);
    }
  };

  if (loaded && !canCrud) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
          Only Super Admin, Chairman, or Director of IT can manage backups.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
          {error}
        </div>
      )}

      {/* Export */}
      <section className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Download className="h-4 w-4 text-indigo-500" />
            Export data
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAll}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            <button
              onClick={exportBundle}
              disabled={exporting || selected.size === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <DatabaseBackup className="h-4 w-4" />
              )}
              Download full backup
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading entities…
            </div>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {entities.map((e) => (
                <li
                  key={e.table}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700"
                >
                  <label className="flex min-w-0 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.has(e.table)}
                      onChange={() => toggle(e.table)}
                      className="h-4 w-4 flex-none accent-indigo-600"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {e.label}
                        {e.sensitive && (
                          <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                            sensitive
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {e.error ? e.error : `${e.count} rows`}
                      </span>
                    </span>
                  </label>
                  <button
                    onClick={() => exportEntityCsv(e.table)}
                    title={`Download ${e.table}.csv`}
                    className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Import */}
      <section className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Upload className="h-4 w-4 text-cyan-500" />
            Import / restore data
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Upload a <code className="font-mono">.lifelink</code> backup bundle
            or individual <code className="font-mono">.csv</code> files. Records
            are restored in relationship-safe order using their original IDs.
          </p>
        </div>

        <div className="space-y-4 px-6 py-4">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".csv,.lifelink,text/csv,text/plain"
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600"
          />

          <div className="flex flex-wrap items-center gap-6">
            <fieldset className="flex items-center gap-4">
              <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                On conflict
              </legend>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "skip"}
                  onChange={() => setMode("skip")}
                  className="h-4 w-4 accent-indigo-600"
                />
                Skip duplicates
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "update"}
                  onChange={() => setMode("update")}
                  className="h-4 w-4 accent-indigo-600"
                />
                Update existing
              </label>
            </fieldset>

            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />
              Dry run (validate only)
            </label>

            <button
              onClick={handleImport}
              disabled={importing}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow transition disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {dryRun ? "Validate" : "Import"}
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {report && (
        <section className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {report.dryRun ? "Validation report" : "Import report"}
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Valid: {report.totals.valid}</span>
              <span>Written: {report.totals.inserted}</span>
              <span>Skipped: {report.totals.skipped}</span>
              <span className={report.totals.errors ? "text-red-600 dark:text-red-400" : ""}>
                Errors: {report.totals.errors}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto px-6 py-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="py-2 pr-4">Entity</th>
                  <th className="py-2 pr-4">Valid</th>
                  <th className="py-2 pr-4">Written</th>
                  <th className="py-2 pr-4">Skipped</th>
                  <th className="py-2 pr-4">Errors</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {report.entities.map((e) => (
                  <Fragment key={e.table}>
                    <tr
                      className="border-b border-slate-100 dark:border-slate-700/60"
                    >
                      <td className="py-2 pr-4 font-semibold text-slate-800 dark:text-slate-100">
                        {e.table}
                      </td>
                      <td className="py-2 pr-4">{e.valid}</td>
                      <td className="py-2 pr-4">{e.inserted}</td>
                      <td className="py-2 pr-4">{e.skipped}</td>
                      <td
                        className={
                          e.errors.length
                            ? "py-2 pr-4 font-semibold text-red-600 dark:text-red-400"
                            : "py-2 pr-4"
                        }
                      >
                        {e.errors.length}
                      </td>
                      <td className="py-2 text-right">
                        {e.errors.length > 0 && (
                          <button
                            onClick={() =>
                              setExpanded(expanded === e.table ? null : e.table)
                            }
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            {expanded === e.table ? "Hide" : "Details"}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expanded === e.table && e.errors.length > 0 && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
                          <ul className="space-y-1 text-xs text-red-700 dark:text-red-300">
                            {e.errors.map((err, idx) => (
                              <li key={idx}>
                                {err.row > 0 ? `Row ${err.row}: ` : ""}
                                {err.message}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Header() {
  return (
    <header>
      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Disaster recovery
      </div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Backup &amp; Restore
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Export all application data to CSV for offline storage, or restore it
        back into the database.
      </p>
    </header>
  );
}
