"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";

import { Button } from "@/components/Button";
import { services } from "@/lib/brand";
import {
  RegistrationValues,
  registrationSchema,
} from "@/lib/registration/schema";

const steps = ["Program", "Personal", "Next of Kin", "Review"] as const;

export function RegistrationWizard() {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("service") ?? "";

  const defaultService = useMemo(() => {
    const match = services.find((s) => s.key === fromQuery)?.key;
    return (match ?? "humanitarian") as RegistrationValues["service"];
  }, [fromQuery]);

  const [step, setStep] = useState<(typeof steps)[number]>("Program");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema) as Resolver<RegistrationValues>,
    defaultValues: {
      service: defaultService,
      fullName: "",
      email: "",
      phone: "",
      address: "",
      occupation: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      notes: "",
    },
    mode: "onBlur",
  });

  const currentIndex = steps.indexOf(step);

  const next = async () => {
    if (step === "Program") {
      setStep("Personal");
      return;
    }

    if (step === "Personal") {
      const ok = await form.trigger([
        "fullName",
        "email",
        "phone",
        "address",
        "occupation",
      ]);
      if (!ok) return;
      setStep("Next of Kin");
      return;
    }

    if (step === "Next of Kin") {
      const ok = await form.trigger(["nextOfKinName", "nextOfKinPhone"]);
      if (!ok) return;
      setStep("Review");
    }
  };

  const back = () => {
    if (step === "Program") return;
    setStep(steps[Math.max(0, currentIndex - 1)]);
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/70 p-8">
        <div className="text-2xl font-semibold text-black">
          Registration received
        </div>
        <div className="mt-3 text-sm leading-7 text-black/70">
          Thank you. Your details have been submitted successfully. Our team will
          reach out with next steps for your selected sector.
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/services" variant="secondary">
            Explore services
          </Button>
          <Button href="/" variant="primary">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const values = form.watch();
  const selectedService = services.find((s) => s.key === values.service);

  return (
    <div className="rounded-3xl border border-black/10 bg-white/70 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-black">E-Registration</div>
          <div className="mt-1 text-sm text-black/70">{steps.join(" • ")}</div>
        </div>
        <div className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
          Step {currentIndex + 1}/{steps.length}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {steps.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              const targetIndex = steps.indexOf(s);
              // Only allow navigating back to completed steps
              if (targetIndex <= currentIndex) setStep(s);
            }}
            className={[
              "h-10 rounded-xl px-3 text-left text-xs font-semibold transition",
              s === step
                ? "bg-[var(--accent)] text-white"
                : "border border-black/10 bg-white text-black/70 hover:bg-black/5 hover:text-black",
            ].join(" ")}
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-8 space-y-6"
        onSubmit={form.handleSubmit(async (data) => {
          setStatus("submitting");
          const res = await fetch("/api/registration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            form.setError("root", {
              type: "server",
              message: json?.error ?? "Failed to submit registration",
            });
            setStatus("idle");
            return;
          }

          setStatus("success");
        })}
      >
        {form.formState.errors.root?.message ? (
          <div className="rounded-2xl border border-black/10 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-800">
            {form.formState.errors.root.message}
          </div>
        ) : null}

        {step === "Program" ? (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-black">
              Choose your preferred sector
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {services.map((s) => {
                const active = values.service === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      form.setValue("service", s.key);
                      setStep("Personal");
                    }}
                    className={[
                      "rounded-3xl border p-6 text-left transition",
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)]/10"
                        : "border-black/10 bg-white hover:bg-black/5",
                    ].join(" ")}
                  >
                    <div className="text-sm font-semibold text-black">
                      {s.title}
                    </div>
                    <div className="mt-1 text-sm text-black/70">{s.subtitle}</div>
                    <div className="mt-4 text-sm text-black/70">{s.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === "Personal" ? (
          <div className="space-y-5">
            <div className="text-lg font-semibold text-black">
              Personal information
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                placeholder="Your full name"
                error={form.formState.errors.fullName?.message}
              >
                <input
                  {...form.register("fullName")}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  autoComplete="name"
                />
              </Field>
              <Field
                label="Phone"
                placeholder="+234..."
                error={form.formState.errors.phone?.message}
              >
                <input
                  {...form.register("phone")}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  autoComplete="tel"
                />
              </Field>
              <Field
                label="Email"
                placeholder="you@example.com"
                error={form.formState.errors.email?.message}
              >
                <input
                  {...form.register("email")}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  autoComplete="email"
                />
              </Field>
              <Field
                label="Occupation"
                placeholder="What you do"
                error={form.formState.errors.occupation?.message}
              >
                <input
                  {...form.register("occupation")}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </Field>
            </div>

            <Field
              label="Address"
              placeholder="Residential address"
              error={form.formState.errors.address?.message}
            >
              <input
                {...form.register("address")}
                className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                autoComplete="street-address"
              />
            </Field>
          </div>
        ) : null}

        {step === "Next of Kin" ? (
          <div className="space-y-5">
            <div className="text-lg font-semibold text-black">Next of kin</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Next of kin name"
                placeholder="Full name"
                error={form.formState.errors.nextOfKinName?.message}
              >
                <input
                  {...form.register("nextOfKinName")}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </Field>
              <Field
                label="Next of kin phone"
                placeholder="+234..."
                error={form.formState.errors.nextOfKinPhone?.message}
              >
                <input
                  {...form.register("nextOfKinPhone")}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </Field>
            </div>

            <Field label="Notes (optional)" error={form.formState.errors.notes?.message}>
              <textarea
                {...form.register("notes")}
                className="min-h-28 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="Any extra information you'd like to share"
              />
            </Field>
          </div>
        ) : null}

        {step === "Review" ? (
          <div className="space-y-5">
            <div className="text-lg font-semibold text-black">Review details</div>
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-sm font-semibold text-black">Selected program</div>
              <div className="mt-2 text-sm text-black/80">
                {selectedService?.title ?? "—"}
              </div>
              <div className="mt-1 text-sm text-black/60">
                {selectedService?.subtitle ?? ""}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ReviewRow label="Full name" value={values.fullName} />
                <ReviewRow label="Phone" value={values.phone} />
                <ReviewRow label="Email" value={values.email} />
                <ReviewRow label="Occupation" value={values.occupation} />
                <ReviewRow label="Address" value={values.address} />
                <ReviewRow label="Next of kin" value={values.nextOfKinName} />
                <ReviewRow label="Next of kin phone" value={values.nextOfKinPhone} />
              </div>

              {values.notes ? (
                <div className="mt-6">
                  <div className="text-sm font-semibold text-black">Notes</div>
                  <div className="mt-2 text-sm leading-7 text-black/70">
                    {values.notes}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <Button variant="ghost" onClick={back} className="justify-center">
            Back
          </Button>

          {step === "Review" ? (
            <Button
              type="submit"
              variant="primary"
              disabled={status === "submitting"}
              className="justify-center"
            >
              {status === "submitting" ? "Submitting..." : "Submit registration"}
            </Button>
          ) : (
            <Button variant="primary" onClick={next} className="justify-center">
              Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  placeholder?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-semibold text-black/80">{label}</div>
      {children}
      {error ? <div className="text-xs font-semibold text-red-800">{error}</div> : null}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
      <div className="text-xs font-semibold text-black/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-black/85">
        {value || "—"}
      </div>
    </div>
  );
}
