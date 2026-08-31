"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  message: z.string().min(10, "Tell us a bit more"),
});

type Values = z.infer<typeof schema>;

export function ContactForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", phone: "", message: "" },
  });

  const submitting = form.formState.isSubmitting;
  const success = form.formState.isSubmitSuccessful;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          form.setError("root", {
            type: "server",
            message: json?.error ?? "Failed to send message",
          });
          return;
        }

        form.reset();
      })}
    >
      {success ? (
        <div className="rounded-2xl border border-black/10 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-800">
          Message sent. We will get back to you shortly.
        </div>
      ) : null}

      {form.formState.errors.root?.message ? (
        <div className="rounded-2xl border border-black/10 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-800">
          {form.formState.errors.root.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-black/80 dark:text-white/80">Full name</label>
          <input
            {...form.register("fullName")}
            className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-white/20 dark:bg-slate-900 dark:text-white"
            placeholder="Your name"
            autoComplete="name"
          />
          {form.formState.errors.fullName?.message ? (
            <div className="text-xs font-semibold text-red-800">
              {form.formState.errors.fullName.message}
            </div>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-black/80 dark:text-white/80">Phone</label>
          <input
            {...form.register("phone")}
            className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-white/20 dark:bg-slate-900 dark:text-white"
            placeholder="+234..."
            autoComplete="tel"
          />
          {form.formState.errors.phone?.message ? (
            <div className="text-xs font-semibold text-red-800">
              {form.formState.errors.phone.message}
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-black/80 dark:text-white/80">Email</label>
        <input
          {...form.register("email")}
          className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-white/20 dark:bg-slate-900 dark:text-white"
          placeholder="you@example.com"
          autoComplete="email"
        />
        {form.formState.errors.email?.message ? (
          <div className="text-xs font-semibold text-red-800">
            {form.formState.errors.email.message}
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-black/80 dark:text-white/80">Message</label>
        <textarea
          {...form.register("message")}
          className="min-h-32 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-white/20 dark:bg-slate-900 dark:text-white"
          placeholder="How can we help?"
        />
        {form.formState.errors.message?.message ? (
          <div className="text-xs font-semibold text-red-800">
            {form.formState.errors.message.message}
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent)]/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
