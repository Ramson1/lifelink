import { Suspense } from "react";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { getManyContent } from "@/lib/content";

export default async function RegisterPage() {
  const c = await getManyContent([
    { key: "registration.title", fallback: "Become a LifeLinker in minutes" },
    { key: "registration.subtitle", fallback: "Select your preferred sector, enter your details, and submit. Our team will review and contact you with next steps." },
  ]);

  return (
    <div className="pt-28 pb-14 sm:pt-32 sm:pb-18">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-start">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="E-Registration"
              title={c["registration.title"]}
              description={c["registration.subtitle"]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
                <div className="text-sm font-semibold text-black">
                  What happens next?
                </div>
                <div className="mt-2 text-sm leading-7 text-black/70">
                  After submission, a representative will reach out to confirm
                  your details and provide onboarding instructions.
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
                <div className="text-sm font-semibold text-black">
                  Need help?
                </div>
                <div className="mt-2 text-sm leading-7 text-black/70">
                  Use the Contact page to ask questions or request a call back.
                </div>
                <a
                  className="mt-4 inline-flex text-sm font-semibold text-black underline underline-offset-4"
                  href="/contact"
                >
                  Contact support
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
              <div className="text-sm font-semibold text-black">Privacy</div>
              <div className="mt-2 text-sm leading-7 text-black/70">
                Your details are used only for registration and membership
                onboarding.
              </div>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="rounded-3xl border border-black/10 bg-white/70 p-8 text-sm text-black/70">
                Loading...
              </div>
            }
          >
            <RegistrationWizard />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
