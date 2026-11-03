"use client";

import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";

import { Button } from "@/components/Button";
import {
  ID_TYPES,
  INVESTMENT_DURATIONS,
  INVESTMENT_TIERS,
  type InvestmentRegistrationValues,
  investmentRegistrationSchema,
  PAYMENT_METHODS,
} from "@/lib/registration/investment-schema";

interface ServiceOption {
  key: string;
  title: string;
  subtitle: string;
  description: string;
}

interface InvestmentFormProps {
  services: ServiceOption[];
  defaultService: string;
}

/**
 * LifeLink Investment and Savings subscription form.
 *
 * Mirrors the official physical subscription form, split into three
 * fieldsets (Part A personal/contact, Part B KYC, Part C investment &
 * payment). Elderly-friendly design tokens match the generic
 * RegistrationForm. Document uploads reuse /api/registration/upload
 * (Cloudinary). Submits the combined payload to /api/registration, where
 * the investment fields are packed into the `investment_data` JSONB column.
 */
export function InvestmentForm({
  services,
  defaultService,
}: InvestmentFormProps) {
  const selectedService = services.find((s) => s.key === defaultService);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const form = useForm<InvestmentRegistrationValues>({
    resolver: zodResolver(
      investmentRegistrationSchema,
    ) as Resolver<InvestmentRegistrationValues>,
    defaultValues: {
      service: "investment",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      occupation: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      notes: "",
      passport: "",
      dateOfBirth: "",
      nationality: "Nigerian",
      idType: "nin",
      idNumber: "",
      idDocumentUrl: "",
      proofOfAddressUrl: "",
      nextOfKinRelationship: "",
      investmentTier: "starter",
      investmentAmount: "",
      investmentDuration: "90",
      paymentMethod: "bank_transfer",
      paymentReference: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
    },
    mode: "onBlur",
  });

  const errors = form.formState.errors;
  const rootError = errors.root?.message;
  const fieldErrorCount = Object.keys(errors).filter((k) => k !== "root").length;
  const showTopBanner =
    form.formState.submitCount > 0 && (rootError || fieldErrorCount > 0);

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
          Thank you — your investment subscription is received
        </h1>
        <p className="mx-auto max-w-lg text-xl leading-8 text-black/80 dark:text-white/80">
          Our investment team will call you on the phone number you gave us and
          guide you through the next steps and payment confirmation.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button href="/" variant="primary" className="h-14 px-8 text-lg">
            Back to home
          </Button>
          <Button
            href="/sectors/investment"
            variant="secondary"
            className="h-14 px-8 text-lg"
          >
            View investment details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
          {selectedService?.title ?? "LifeLink Investment and Savings"}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl dark:text-white">
          Investment Subscription Form
        </h1>
        <p className="text-xl leading-8 text-black/80 dark:text-white/80">
          Let your money work for you. Fill in the three short sections below to
          subscribe. It takes about five minutes.
        </p>
        <div className="pt-1">
          <a
            href="/register?service=all"
            className="text-base font-semibold text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
          >
            Want to join a different sector instead?
          </a>
        </div>
      </header>

      {showTopBanner ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-2xl border-2 border-red-500 bg-red-50 p-5 text-lg font-semibold text-red-800 dark:border-red-400 dark:bg-red-950/50 dark:text-red-100"
        >
          {rootError ??
            "Please check the fields marked in red below, then try again."}
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
        <input type="hidden" {...form.register("service")} />

        {/* ================= Part A: Personal & Contact ================= */}
        <fieldset className="space-y-6">
          <legend className="text-2xl font-bold text-black dark:text-white">
            Part A — Personal &amp; Contact Information
          </legend>

          <Field
            id="fullName"
            label="Full name (Surname first)"
            helper="Example: Okafor Chinedu."
            error={errors.fullName?.message}
          >
            <input
              id="fullName"
              {...form.register("fullName")}
              className={inputClass}
              autoComplete="name"
              placeholder="Surname, First and Middle name"
              enterKeyHint="next"
            />
          </Field>

          <Field
            id="address"
            label="Residential / Office address"
            error={errors.address?.message}
          >
            <input
              id="address"
              {...form.register("address")}
              className={inputClass}
              autoComplete="street-address"
              placeholder="House number, street, city, state"
              enterKeyHint="next"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id="phone"
              label="Phone number"
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
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id="dateOfBirth"
              label="Date of birth"
              error={errors.dateOfBirth?.message}
            >
              <input
                id="dateOfBirth"
                type="date"
                {...form.register("dateOfBirth")}
                className={inputClass}
                autoComplete="bday"
              />
            </Field>

            <Field
              id="nationality"
              label="Nationality"
              error={errors.nationality?.message}
            >
              <input
                id="nationality"
                {...form.register("nationality")}
                className={inputClass}
                placeholder="e.g. Nigerian"
                enterKeyHint="next"
              />
            </Field>
          </div>
        </fieldset>

        {/* ================= Part B: KYC & Verification ================= */}
        <fieldset className="space-y-6">
          <legend className="text-2xl font-bold text-black dark:text-white">
            Part B — KYC &amp; Verification
          </legend>
          <p className="text-lg text-black/80 dark:text-white/80">
            This helps us meet regulatory requirements and keep your investment
            secure.
          </p>

          <Field
            id="idType"
            label="Type of ID"
            error={errors.idType?.message}
          >
            <select
              id="idType"
              {...form.register("idType")}
              className={inputClass}
            >
              {ID_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="idNumber"
            label="ID card number"
            error={errors.idNumber?.message}
          >
            <input
              id="idNumber"
              {...form.register("idNumber")}
              className={inputClass}
              placeholder="Enter your ID number"
              enterKeyHint="next"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <UploadField
              label="Upload Photo ID"
              helper="A clear photo of your ID card."
              value={form.watch("idDocumentUrl")}
              error={errors.idDocumentUrl?.message}
              onUploaded={(url) => form.setValue("idDocumentUrl", url)}
            />
            <UploadField
              label="Upload Proof of Address"
              helper="Utility bill or tenancy agreement."
              value={form.watch("proofOfAddressUrl")}
              error={errors.proofOfAddressUrl?.message}
              onUploaded={(url) => form.setValue("proofOfAddressUrl", url)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id="nextOfKinName"
              label="Next of kin — full name"
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
              label="Next of kin — phone"
              error={errors.nextOfKinPhone?.message}
            >
              <input
                id="nextOfKinPhone"
                {...form.register("nextOfKinPhone")}
                className={inputClass}
                inputMode="tel"
                autoComplete="tel"
                placeholder="0803 000 0000"
                enterKeyHint="next"
              />
            </Field>
          </div>

          <Field
            id="nextOfKinRelationship"
            label="Relationship with next of kin"
            helper="Example: spouse, brother, friend."
            error={errors.nextOfKinRelationship?.message}
          >
            <input
              id="nextOfKinRelationship"
              {...form.register("nextOfKinRelationship")}
              className={inputClass}
              placeholder="Your relationship"
              enterKeyHint="next"
            />
          </Field>
        </fieldset>

        {/* ============ Part C: Investment & Payment Details ============ */}
        <fieldset className="space-y-6">
          <legend className="text-2xl font-bold text-black dark:text-white">
            Part C — Investment &amp; Payment Details
          </legend>

          {/* Tier selector */}
          <div className="space-y-2">
            <span className="block text-lg font-bold text-black dark:text-white">
              Selected investment tier
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              {INVESTMENT_TIERS.map((tier) => (
                <TierOption
                  key={tier.key}
                  tier={tier}
                  selected={form.watch("investmentTier") === tier.key}
                  onSelect={() => {
                    form.setValue("investmentTier", tier.key, {
                      shouldValidate: true,
                    });
                  }}
                />
              ))}
            </div>
            {errors.investmentTier?.message ? (
              <p className={errorClass} role="alert">
                {errors.investmentTier.message}
              </p>
            ) : null}
          </div>

          <Field
            id="investmentAmount"
            label="Investment amount (₦)"
            helper="Enter the exact amount within your chosen tier."
            error={errors.investmentAmount?.message}
          >
            <input
              id="investmentAmount"
              {...form.register("investmentAmount")}
              className={inputClass}
              inputMode="numeric"
              placeholder="e.g. 500000"
              enterKeyHint="next"
            />
          </Field>

          {/* Duration selector */}
          <div className="space-y-2">
            <span className="block text-lg font-bold text-black dark:text-white">
              Investment duration
            </span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {INVESTMENT_DURATIONS.map((d) => (
                <PillOption
                  key={d.value}
                  label={d.label}
                  selected={form.watch("investmentDuration") === d.value}
                  onSelect={() =>
                    form.setValue("investmentDuration", d.value, {
                      shouldValidate: true,
                    })
                  }
                />
              ))}
            </div>
            {errors.investmentDuration?.message ? (
              <p className={errorClass} role="alert">
                {errors.investmentDuration.message}
              </p>
            ) : null}
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <span className="block text-lg font-bold text-black dark:text-white">
              Payment method
            </span>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((m) => (
                <PillOption
                  key={m.value}
                  label={m.label}
                  selected={form.watch("paymentMethod") === m.value}
                  onSelect={() =>
                    form.setValue("paymentMethod", m.value, {
                      shouldValidate: true,
                    })
                  }
                />
              ))}
            </div>
            {errors.paymentMethod?.message ? (
              <p className={errorClass} role="alert">
                {errors.paymentMethod.message}
              </p>
            ) : null}
          </div>

          <Field
            id="paymentReference"
            label="Payment reference / Teller number"
            helper="Enter the transaction or teller deposit number after payment."
            error={errors.paymentReference?.message}
          >
            <input
              id="paymentReference"
              {...form.register("paymentReference")}
              className={inputClass}
              placeholder="e.g. TRF202400123"
              enterKeyHint="next"
            />
          </Field>

          <div className="space-y-6 rounded-2xl border-2 border-black/10 bg-black/[0.02] p-5 dark:border-white/15 dark:bg-white/[0.03]">
            <div className="text-lg font-bold text-black dark:text-white">
              Your bank account (where returns are paid)
            </div>
            <Field
              id="bankName"
              label="Bank name"
              error={errors.bankName?.message}
            >
              <input
                id="bankName"
                {...form.register("bankName")}
                className={inputClass}
                placeholder="e.g. Guaranty Trust Bank"
                enterKeyHint="next"
              />
            </Field>

            <Field
              id="accountName"
              label="Account name"
              error={errors.accountName?.message}
            >
              <input
                id="accountName"
                {...form.register("accountName")}
                className={inputClass}
                placeholder="Name on the account"
                enterKeyHint="next"
              />
            </Field>

            <Field
              id="accountNumber"
              label="Account number"
              helper="10-digit NUBAN account number."
              error={errors.accountNumber?.message}
            >
              <input
                id="accountNumber"
                {...form.register("accountNumber")}
                className={inputClass}
                inputMode="numeric"
                placeholder="10-digit account number"
                enterKeyHint="done"
              />
            </Field>
          </div>

          {/* Optional notes */}
          <details className="group rounded-2xl border-2 border-black/15 bg-white p-5 dark:border-white/20 dark:bg-slate-900">
            <summary className="cursor-pointer list-none text-lg font-bold text-black marker:content-none dark:text-white">
              <span className="inline-flex items-center gap-2">
                <span className="text-2xl leading-none transition-transform group-open:rotate-90">
                  ›
                </span>
                Add anything else (optional)
              </span>
            </summary>
            <div className="mt-6">
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
            </div>
          </details>
        </fieldset>

        {/* ---- Submit ---- */}
        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-shine h-16 w-full rounded-2xl text-2xl font-extrabold text-white shadow-xl transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/40 disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "submitting" ? "Please wait..." : "Submit subscription"}
          </button>
          <p className="mt-3 text-center text-base text-black/60 dark:text-white/60">
            Your details go straight to the LifeLink investment team. We will
            never share them.
          </p>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared elderly-friendly design tokens (mirrors RegistrationForm).
// ---------------------------------------------------------------------------
const inputClass =
  "h-14 w-full rounded-2xl border-2 border-black/20 bg-white px-5 text-lg text-black outline-none placeholder:text-black/40 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/40 dark:border-white/25 dark:bg-slate-900 dark:text-white dark:placeholder:text-white/40";

const helperClass = "mt-1 text-base text-black/70 dark:text-white/70";

const errorClass =
  "mt-1.5 text-base font-semibold text-red-700 dark:text-red-400";

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

/** Radio-style tier card showing name, range, category and monthly interest. */
function TierOption({
  tier,
  selected,
  onSelect,
}: {
  tier: (typeof INVESTMENT_TIERS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-2xl border-2 p-5 text-left transition focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/30 ${
        selected
          ? "border-[var(--accent)] bg-[var(--accent)]/5"
          : "border-black/15 bg-white hover:border-black/30 dark:border-white/20 dark:bg-slate-900 dark:hover:border-white/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-lg font-bold text-black dark:text-white">
          {tier.label}
        </span>
        {selected ? (
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-base font-semibold text-[var(--accent)]">
        {tier.range}
      </div>
      <div className="mt-0.5 text-sm text-black/60 dark:text-white/60">
        {tier.category} · {tier.monthlyInterest}/month
      </div>
    </button>
  );
}

/** Radio-style pill for durations and payment methods. */
function PillOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`h-14 rounded-2xl border-2 px-4 text-lg font-bold transition focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/30 ${
        selected
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-black/15 bg-white text-black hover:border-black/30 dark:border-white/20 dark:bg-slate-900 dark:text-white dark:hover:border-white/40"
      }`}
    >
      {label}
    </button>
  );
}

/** Single-file image uploader to /api/registration/upload (Cloudinary). */
function UploadField({
  label,
  helper,
  value,
  error,
  onUploaded,
}: {
  label: string;
  helper: string;
  value: string;
  error?: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError("");
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("The image is too big. Please pick a smaller one.");
        return;
      }
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
      ) {
        setUploadError("Please pick a regular image (JPG or PNG).");
        return;
      }
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/registration/upload", {
          method: "POST",
          body: fd,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setUploadError(json.error ?? "Could not upload the image.");
          return;
        }
        onUploaded(json.url);
      } catch {
        setUploadError("Network problem — please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  return (
    <div className="space-y-2 rounded-2xl border-2 border-black/15 bg-white p-4 dark:border-white/20 dark:bg-slate-900">
      <div className="text-lg font-bold text-black dark:text-white">{label}</div>
      <p className={helperClass}>{helper}</p>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-black/25 dark:border-white/25">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              className="h-8 w-8 text-black/30 dark:text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl border-2 border-black/20 bg-white px-4 py-2.5 text-base font-bold text-black transition hover:bg-black/5 disabled:opacity-50 dark:border-white/25 dark:bg-slate-900 dark:text-white dark:hover:bg-white/10"
          >
            {uploading ? "Uploading..." : value ? "Change image" : "Choose image"}
          </button>
          {uploadError ? (
            <div className="mt-2 text-base font-semibold text-red-700 dark:text-red-400">
              {uploadError}
            </div>
          ) : null}
        </div>
      </div>
      {error ? (
        <p className={errorClass} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
