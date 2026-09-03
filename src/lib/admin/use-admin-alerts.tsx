"use client";

import { useCallback, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
} from "lucide-react";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

let counter = 0;

export function useAdminAlerts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      const id = Date.now() + counter++;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const confirm = useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      setConfirmDialog({ open: true, title, message, onConfirm });
    },
    [],
  );

  const closeConfirm = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const Alerts = useCallback(
    () => (
      <>
        {/* Toast notifications */}
        <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={[
                "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur",
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50/95 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/95 dark:text-emerald-200"
                  : "border-red-200 bg-red-50/95 text-red-800 dark:border-red-800 dark:bg-red-900/95 dark:text-red-200",
              ].join(" ")}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-none text-red-500 dark:text-red-400" />
              )}
              <span className="text-sm font-semibold">{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="ml-2 flex-none rounded-lg p-0.5 transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Confirm dialog */}
        {confirmDialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    {confirmDialog.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {confirmDialog.message}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeConfirm}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    closeConfirm();
                    confirmDialog.onConfirm();
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    ),
    [toasts, confirmDialog, dismissToast, closeConfirm],
  );

  return { showToast, confirm, Alerts };
}
