"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  Send,
  Pencil,
  Trash2,
  Check,
  X,
  Reply,
} from "lucide-react";
import Link from "next/link";
import { useAdminAlerts } from "@/lib/admin/use-admin-alerts";
import { useAdminPermissions } from "@/lib/admin/use-admin-permissions";

const replySchema = z.object({ body: z.string().min(1) });
const editSchema = z.object({ body: z.string().min(1) });

interface Sender {
  id: string;
  full_name: string;
  email: string;
}

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
}

interface Message {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  sender_id: string;
  reply_to: string | null;
  sender?: Sender;
  recipients?: Array<{ admin_id: string; admins?: { full_name: string } }>;
  attachments?: Attachment[];
  replies?: Message[];
}

export default function MessageThreadPage() {
  const { id } = useParams<{ id: string }>();
  const [root, setRoot] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showToast, confirm, Alerts } = useAdminAlerts();
  const { canCrud } = useAdminPermissions();

  const replyForm = useForm<{ body: string }>({
    resolver: zodResolver(replySchema),
    defaultValues: { body: "" },
  });
  const editForm = useForm<{ body: string }>({
    resolver: zodResolver(editSchema),
    defaultValues: { body: "" },
  });

  const load = async () => {
    setLoading(true);
    const [mRes, meRes] = await Promise.all([
      fetch(`/api/admin/messages/${id}`),
      fetch("/api/admin/auth/me"),
    ]);
    const [mJson, meJson] = await Promise.all([
      mRes.json().catch(() => ({})),
      meRes.json().catch(() => ({})),
    ]);
    if (!mRes.ok) {
      setError(mJson.error ?? "Failed to load thread");
    } else {
      setRoot(mJson.message);
    }
    setCurrentId(meJson.admin?.id ?? null);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onReply = async (values: { body: string }) => {
    const recipients = root?.sender_id
      ? [root.sender_id]
      : [];
    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: values.body,
        recipient_ids: recipients,
        reply_to: id,
      }),
    });
    if (!res.ok) {
      showToast("error", "Failed to send reply");
      return;
    }
    replyForm.reset();
    setReplyTo(null);
    showToast("success", "Reply sent");
    await load();
  };

  const onSaveEdit = async (msgId: string, values: { body: string }) => {
    const res = await fetch(`/api/admin/messages/${msgId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: values.body }),
    });
    if (!res.ok) {
      showToast("error", "Failed to update message");
      return;
    }
    setEditingId(null);
    showToast("success", "Message updated");
    await load();
  };

  const onDelete = (msgId: string) => {
    confirm(
      "Delete message",
      "Are you sure you want to delete this message? This action cannot be undone.",
      async () => {
        const res = await fetch(`/api/admin/messages/${msgId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          showToast("error", "Failed to delete");
          return;
        }
        showToast("success", "Message deleted");
        await load();
      },
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!root) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Message not found.
      </div>
    );
  }

  const allMessages = [root, ...(root.replies ?? [])];

  return (
    <div className="space-y-6">
      <Alerts />
      <div>
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to messages
        </Link>
      </div>

      <header>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Thread
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Conversation
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Started by {root.sender?.full_name ?? "Unknown"} ·{" "}
          {new Date(root.created_at).toLocaleString()}
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {allMessages.map((m) => {
          const isMine = m.sender_id === currentId;
          const isEditing = editingId === m.id;
          return (
            <div
              key={m.id}
              className={[
                "rounded-3xl border border-slate-200 bg-white p-5",
                isMine ? "ml-0 sm:ml-10" : "mr-0 sm:mr-10",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {m.sender?.full_name ?? "Unknown"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(m.created_at).toLocaleString()}
                    {m.updated_at !== m.created_at && " · edited"}
                  </div>
                </div>
                {isMine && canCrud && (
                  <div className="flex items-center gap-1">
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => {
                            setReplyTo(m.id);
                            replyForm.reset({ body: "" });
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(m.id);
                            editForm.reset({ body: m.body });
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(m.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <form
                  onSubmit={editForm.handleSubmit((v) => onSaveEdit(m.id, v))}
                  className="mt-3"
                >
                  <textarea
                    rows={3}
                    {...editForm.register("body")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      <Check className="h-3.5 w-3.5" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {m.body}
                </div>
              )}

              {m.attachments && m.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.attachments.map((a) => (
                    <a
                      key={a.id}
                      href={a.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      {a.file_name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {canCrud && replyTo && (
        <form
          onSubmit={replyForm.handleSubmit(onReply)}
          className="rounded-3xl border border-slate-200 bg-white p-5"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700">
              Replying to thread
            </div>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
          <textarea
            rows={3}
            {...replyForm.register("body")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <div className="mt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Send className="h-4 w-4" /> Send reply
            </button>
          </div>
        </form>
      )}

      {canCrud && !replyTo && (
        <button
          onClick={() => {
            setReplyTo(id as string);
            replyForm.reset({ body: "" });
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <Reply className="h-4 w-4" /> Reply to thread
        </button>
      )}
    </div>
  );
}
