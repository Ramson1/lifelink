import { Suspense } from "react";

import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { getManyContent } from "@/lib/content";
import { services } from "@/lib/brand";

export const dynamic = "force-dynamic";

interface DbSector {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  is_active: boolean;
}

async function getDbSectors(): Promise<DbSector[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/sectors`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.items ?? []).filter((s: DbSector) => s.is_active);
  } catch {
    return [];
  }
}

export default async function RegisterPage() {
  const [c, dbSectors] = await Promise.all([
    getManyContent([
      { key: "registration.title", fallback: "Become a LifeLinker in minutes" },
      { key: "registration.subtitle", fallback: "Select your preferred sector, enter your details, and submit. Our team will review and contact you with next steps." },
    ]),
    getDbSectors(),
  ]);

  // Merge: hardcoded services NOT in DB + all DB sectors
  const dbKeys = new Set(dbSectors.map((s) => s.key));
  const allServices = [
    ...services
      .filter((s) => !dbKeys.has(s.key))
      .map((s) => ({ key: s.key, title: s.title, subtitle: s.subtitle, description: s.description })),
    ...dbSectors.map((s) => ({ key: s.key, title: s.title, subtitle: s.subtitle, description: s.description })),
  ];

  return (
    <div className="pt-28 pb-14 sm:pt-32 sm:pb-18">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-start">
          <div className="space-y-6">
            <ScrollReveal>
              <SectionHeading
                eyebrow="E-Registration"
                title={c["registration.title"]}
                description={c["registration.subtitle"]}
              />
            </ScrollReveal>

            <ScrollReveal delay={100}>

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
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
                <div className="text-sm font-semibold text-black">Privacy</div>
                <div className="mt-2 text-sm leading-7 text-black/70">
                  Your details are used only for registration and membership
                  onboarding.
                </div>
              </div>
            </ScrollReveal>
          </div>

          <Suspense
            fallback={
              <div className="rounded-3xl border border-black/10 bg-white/70 p-8 text-sm text-black/70">
                Loading...
              </div>
            }
          >
            <RegistrationWizard services={allServices} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
