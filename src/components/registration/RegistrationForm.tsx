"use client";

import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";

import { Button } from "@/components/Button";
import {
  type RegistrationValues,
  registrationSchema,
} from "@/lib/registration/schema";

interface ServiceOption {
  key: string;
  title: string;
  subtitle: string;
  description: string;
}

interface RegistrationFormProps {
  services: ServiceOption[];
  defaultService: string;
}

/**
 * Elderly-friendly single-page registration form.
 *
 * One page, one column, one big Submit. No steps, no chips, no review —
 * just plain-English questions asked one after another. Same POST payload
 * and same zod schema the multi-step wizard used, so the API, DB, admin
 * dashboard, and CSV backup/restore all keep working unchanged.
 */
export function RegistrationForm({
  services,
  defaultService,
}: RegistrationFormProps) {
  const selectedService = services.find((s) => s.key === defaultService);
  const [pickerOpen, setPickerOpen] = useState(
    defaultService === "all" || !selectedService,
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [passportUploading, setPassportUploading] = useState(false);
  const [passportError, setPassportError] = useState("");
  const passportInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema) as Resolver<RegistrationValues>,
    defaultValues: {
      service: defaultService as RegistrationValues["service"],
      fullName: "",
      email: "",
      phone: "",
      address: "",
      occupation: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      notes: "",
      passport: "",
    },
    mode: "onBlur",
  });

  const uploadPassport = useCallback(
    async (file: File) => {
      setPassportError("");
      if (file.size > 2 * 1024 * 1024) {
        setPassportError("The photo is too big. Please pick a smaller one.");
        return;
      }
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
      ) {
        setPassportError("Please pick a regular photo (JPG or PNG).");
        return;
      }
      setPassportUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/registration/upload", {
          method: "POST",
          body: fd,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setPassportError(json.error ?? "Could not upload the photo.");
          return;
        }
        setPassportPreview(json.url);
        form.setValue("passport", json.url);
      } catch {
        setPassportError("Network problem — please try again.");
      } finally {
        setPassportUploading(false);
      }
    },
    [form],
  );

  const handlePassportChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadPassport(file);
      e.target.value = "";
    },
    [uploadPassport],
  );

  const errors = form.formState.errors;
  const rootError = errors.root?.message;
  const fieldErrorCount = Object.keys(errors).filter((k) => k !== "root").length;
  const showTopBanner = form.formState.submitCount > 0 && (rootError || fieldErrorCount > 0);

  if (status === "success") {
    return (
      <div className="space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl dark:text-white">
          Thank you — we&apos;ve received your details
        </h1>
        <p className="mx-auto max-w-lg text-xl leading-8 text-black/80 dark:text-white/80">
          Our team will call you on the phone number you gave us and guide you
          through the next steps.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button href="/" variant="primary" className="h-14 px-8 text-lg">
            Back to home
          </Button>
          <Button href="/services" variant="secondary" className="h-14 px-8 text-lg">
            Explore services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl dark:text-white">
          Join LifeLink
        </h1>
        <p className="text-xl leading-8 text-black/80 dark:text-white/80">
          Please fill in this short form. It takes about two minutes.
        </p>
      </header>

      {showTopBanner ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-2xl border-2 border-red-500 bg-red-50 p-5 text-lg font-semibold text-red-800 dark:border-red-400 dark:bg-red-950/50 dark:text-red-100"
        >
          {rootError ?? "Please check the fields marked in red below, then try again."}
        </div>
      ) : null}

      <form
        className="space-y-10"
        onSubmit={form.handleSubmit(async (data) => {
          setStatus("submitting");
          try {
            const res = await fetch("/api/registration", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) {
              const json = await res.json().catch(() => ({}));
              form.setError("root", {
                type: "server",
                message:
                  json?.error ??
                  "Sorry — something went wrong. Please try again in a moment.",
              });
              setStatus("idle");
              return;
            }
            setStatus("success");
          } catch {
            form.setError("root", {
              type: "server",
              message:
                "We could not reach the internet. Please check your connection and try again.",
            });
            setStatus("idle");
          }
        })}
      >
        {/* ---- Sector picker ---- */}
        <fieldset className="space-y-4">
          <legend className="text-2xl font-bold text-black dark:text-white">
            What would you like to join?
          </legend>

          {selectedService && selectedService.key !== "all" && !pickerOpen ? (
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-[var(--accent)]/50 bg-[var(--accent)]/5 p-5 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
                  Selected for you
                </div>
                <div className="mt-1 text-xl font-bold text-black dark:text-white">
                  {selectedService.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="rounded-xl border-2 border-[var(--accent)] px-5 py-2.5 text-base font-bold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/30"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label
                htmlFor="service"
                className="block text-lg font-bold text-black dark:text-white"
              >
                Pick the sector that fits you best
              </label>
              <select
                id="service"
                {...form.register("service")}
                className={inputClass}
              >
                {services.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.title}
                  </option>
                ))}
              </select>
              <p className={helperClass}>
                Not sure? Pick &quot;I&apos;m not sure — help me choose&quot; and our team
                will call you.
              </p>
            </div>
          )}
        </fieldset>

        {/* ---- Your details ---- */}
        <fieldset className="space-y-6">
          <legend className="text-2xl font-bold text-black dark:text-white">
            Your details
          </legend>

          <Field
            id="fullName"
            label="Your full name"
            helper="First, middle, and family name."
            error={errors.fullName?.message}
          >
            <input
              id="fullName"
              {...form.register("fullName")}
              className={inputClass}
              autoComplete="name"
              placeholder="e.g. Chinedu Okafor"
              enterKeyHint="next"
            />
          </Field>

          <Field
            id="phone"
            label="Phone number"
            helper="The number we should call you on."
            error={errors.phone?.message}
          >
            <input
              id="phone"
              {...form.register("phone")}
              className={inputClass}
              autoComplete="tel"
              inputMode="tel"
              placeholder="0803 000 0000"
              enterKeyHint="next"
            />
          </Field>

          <Field
            id="email"
            label="Email address"
            helper="If you don't have one, use a family member's or a friend's email we can reach you on."
            error={errors.email?.message}
          >
            <input
              id="email"
              {...form.register("email")}
              className={inputClass}
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              enterKeyHint="next"
            />
          </Field>

          <Field
            id="address"
            label="Where you live"
            helper="House number, street, city, and state."
            error={errors.address?.message}
          >
            <input
              id="address"
              {...form.register("address")}
              className={inputClass}
              autoComplete="street-address"
              placeholder="12 Marina Road, Port Harcourt"
              enterKeyHint="next"
            />
          </Field>

          <Field
            id="occupation"
            label="What you do"
            helper="Example: trader, teacher, retired."
            error={errors.occupation?.message}
          >
            <input
              id="occupation"
              {...form.register("occupation")}
              className={inputClass}
              autoComplete="organization"
              placeholder="Your work or business"
              enterKeyHint="next"
            />
          </Field>
        </fieldset>

        {/* ---- Emergency contact ---- */}
        <fieldset className="space-y-6">
          <legend className="text-2xl font-bold text-black dark:text-white">
            In an emergency
          </legend>
          <p className="text-lg text-black/80 dark:text-white/80">
            Who should we call if we cannot reach you?
          </p>

          <Field
            id="nextOfKinName"
            label="Their full name"
            error={errors.nextOfKinName?.message}
          >
            <input
              id="nextOfKinName"
              {...form.register("nextOfKinName")}
              className={inputClass}
              placeholder="Full name"
              enterKeyHint="next"
            />
          </Field>

          <Field
            id="nextOfKinPhone"
            label="Their phone number"
            error={errors.nextOfKinPhone?.message}
          >
            <input
              id="nextOfKinPhone"
              {...form.register("nextOfKinPhone")}
              className={inputClass}
              inputMode="tel"
              autoComplete="tel"
              placeholder="0803 000 0000"
            />
          </Field>
        </fieldset>

        {/* ---- Optional extras ---- */}
        <details className="group rounded-2xl border-2 border-black/15 bg-white p-5 dark:border-white/20 dark:bg-slate-900">
          <summary className="cursor-pointer list-none text-lg font-bold text-black marker:content-none dark:text-white">
            <span className="inline-flex items-center gap-2">
              <span className="text-2xl leading-none transition-transform group-open:rotate-90">
                ›
              </span>
              Add anything else (optional)
            </span>
          </summary>
          <p className="mt-2 text-base text-black/70 dark:text-white/70">
            You don&apos;t need to fill these in. Open this only if you want to.
          </p>

          <div className="mt-6 space-y-6">
            <Field
              id="notes"
              label="Anything you would like us to know"
              error={errors.notes?.message}
            >
              <textarea
                id="notes"
                {...form.register("notes")}
                className={`${inputClass} h-auto min-h-32 py-4`}
                placeholder="Optional"
              />
            </Field>

            <div className="space-y-2">
              <div className="text-lg font-bold text-black dark:text-white">
                Add your photo (optional)
              </div>
              <div className="mt-1 text-base text-black/70 dark:text-white/70">
                Any clear photo of your face. You can skip this.
              </div>
              <div className="mt-3 flex items-center gap-4">
                {passportPreview ? (
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-black/15 dark:border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={passportPreview}
                      alt="Your photo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-black/25 dark:border-white/25">
                    <svg
                      className="h-10 w-10 text-black/30 dark:text-white/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={passportInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePassportChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => passportInputRef.current?.click()}
                    disabled={passportUploading}
                    className="rounded-xl border-2 border-black/20 bg-white px-5 py-3 text-base font-bold text-black transition hover:bg-black/5 disabled:opacity-50 dark:border-white/25 dark:bg-slate-900 dark:text-white dark:hover:bg-white/10"
                  >
                    {passportUploading
                      ? "Adding..."
                      : passportPreview
                        ? "Change photo"
                        : "Choose photo"}
                  </button>
                  {passportError ? (
                    <div className="mt-2 text-base font-semibold text-red-700 dark:text-red-400">
                      {passportError}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* ---- Submit ---- */}
        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-shine h-16 w-full rounded-2xl text-2xl font-extrabold text-white shadow-xl transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/40 disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "submitting" ? "Please wait..." : "Submit"}
          </button>
          <p className="mt-3 text-center text-base text-black/60 dark:text-white/60">
            Your details go straight to the LifeLink team. We will never share them.
          </p>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared elderly-friendly design tokens for this form.
// ---------------------------------------------------------------------------
const inputClass =
  "h-14 w-full rounded-2xl border-2 border-black/20 bg-white px-5 text-lg text-black outline-none placeholder:text-black/40 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/40 dark:border-white/25 dark:bg-slate-900 dark:text-white dark:placeholder:text-white/40";

const helperClass = "mt-1 text-base text-black/70 dark:text-white/70";

const errorClass = "mt-1.5 text-base font-semibold text-red-700 dark:text-red-400";

function Field({
  id,
  label,
  helper,
  error,
  children,
}: {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  // Accessibility model:
  // - Visible <label> is tied to the input via htmlFor (the input has id=<id>).
  // - Error text carries role="alert" so screen readers announce it on appear.
  // - The input receives aria-invalid + aria-describedby via the caller's
  //   spread of {...form.register(name)} when a matching error exists.
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-lg font-bold text-black dark:text-white"
      >
        {label}
      </label>
      {children}
      {helper && !error ? (
        <p id={`${id}-helper`} className={helperClass}>
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={errorClass} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
