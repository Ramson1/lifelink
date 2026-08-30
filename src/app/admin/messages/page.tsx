"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MessageSquare,
  Loader2,
  Plus,
  Send,
  Paperclip,
  X,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

const schema = z.object({
  body: z.string().min(1, "Message cannot be empty"),
  recipient_ids: z.array(z.string().uuid()).min(1, "Select at least one recipient"),
});

type Form = z.infer<typeof schema>;

interface Admin {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  reply_to: string | null;
  sender?: { id: string; full_name: string; email: string };
  recipients?: Array<{ admin_id: string; admins?: { full_name: string; email: string } }>;
  attachments?: Array<{ id: string; file_name: string; file_url: string; file_type: string | null }>;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { showToast, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { body: "", recipient_ids: [] },
  });

  const load = async () => {
    setLoading(true);
    try {
      const [mRes, aRes, meRes] = await Promise.all([
        fetch("/api/admin/messages"),
        fetch("/api/admin/admins"),
        fetch("/api/admin/auth/me"),
      ]);
      const [mJson, aJson, meJson] = await Promise.all([
        mRes.json().catch(() => ({})),
        aRes.json().catch(() => ({})),
        meRes.json().catch(() => ({})),
      ]);
      if (!mRes.ok) setError(mJson.error ?? "Failed to load messages");
      setMessages(mJson.messages ?? []);
      setAdmins(aJson.admins ?? []);
      setCurrentId(meJson.admin?.id ?? null);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const onSend = async (values: Form) => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast("error", json.error ?? "Failed to send");
        return;
      }
      const messageId = json.message?.id;

      // Optional file attachment
      if (file && messageId) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("message_id", messageId);
        await fetch("/api/admin/messages/upload", { method: "POST", body: fd });
      }

      form.reset();
      setFile(null);
      setShowCompose(false);
      showToast("success", "Message sent successfully");
      await load();
    } catch {
      showToast("error", "Network error");
    } finally {
      setSending(false);
    }
  };

  const toggleRecipient = (id: string) => {
    const current = form.getValues("recipient_ids") ?? [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    form.setValue("recipient_ids", next, { shouldValidate: true });
  };

  const selectedRecipients = form.watch("recipient_ids");

  const grouped = useMemo(() => {
    // Group messages by thread root (reply_to ?? id)
    const map = new Map<string, Message[]>();
    for (const m of messages) {
      const root = m.reply_to ?? m.id;
      if (!map.has(root)) map.set(root, []);
      map.get(root)!.push(m);
    }
    return Array.from(map.entries())
      .map(([root, items]) => ({
        root,
        latest: items.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        )[0],
        count: items.length,
      }))
      .sort(
        (a, b) =>
          new Date(b.latest.created_at).getTime() -
          new Date(a.latest.created_at).getTime(),
      );
  }, [messages]);

  return (
    <div className="space-y-6">
      <Alerts />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Communication
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Private conversations between admins.
          </p>
        </div>
        {canCrud && (
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              title="Refresh messages"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setShowCompose((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
            >
              {showCompose ? (
                <>
                  <X className="h-4 w-4" /> Close
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> New message
                </>
              )}
            </button>
          </div>
        )}
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {showCompose && (
        <form
          onSubmit={form.handleSubmit(onSend)}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Compose message
          </h2>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Recipients
            </label>
            <div className="flex flex-wrap gap-2">
              {admins
                .filter((a) => a.id !== currentId)
                .map((a) => {
                  const selected = selectedRecipients?.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleRecipient(a.id)}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        selected
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {a.full_name}
                    </button>
                  );
                })}
            </div>
            {form.formState.errors.recipient_ids && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                {form.formState.errors.recipient_ids.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Message
            </label>
            <textarea
              rows={4}
              {...form.register("body")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            {form.formState.errors.body && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                {form.formState.errors.body.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Paperclip className="h-3.5 w-3.5" /> Attachment (max 5MB)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send message
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCompose(false);
                form.reset();
                setFile(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <MessageSquare className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">
            Conversations ({grouped.length})
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : grouped.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No messages yet. Start a conversation.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {grouped.map((g) => (
              <li key={g.root}>
                <Link
                  href={`/admin/messages/${g.root}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {g.latest.sender?.full_name ?? "Unknown"}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {g.latest.body}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {g.count > 1 && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {g.count}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(g.latest.created_at).toLocaleString()}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
