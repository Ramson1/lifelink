import Image from "next/image";

import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return {
    title: `Our Partners — ${brand.shortName}`,
    description:
      "Trusted organizations and businesses partnering with LifeLink Group to create impact across communities.",
  };
}

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  category: string;
}

async function getPartners(): Promise<Partner[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/partners`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.items ?? [];
  } catch {
    return [];
  }
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <div className="pt-28 pb-14 sm:pt-32 sm:pb-18">
      <Container>
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Partners</div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">Trusted by our partners</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We collaborate with forward-thinking organizations to deliver impactful programs, expand opportunities, and build stronger communities across Nigeria and beyond.
            </p>
          </div>
        </ScrollReveal>

        {partners.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
            {partners.map((partner, i) => {
              const content = (
                <div
                  className="group flex flex-col items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-8 transition hover:bg-white hover:shadow-lg"
                >
                  <Image
                    src={partner.logo_url}
                    alt={partner.name}
                    width={140}
                    height={56}
                    className="h-12 w-auto object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                  />
                  <div className="mt-3 text-sm font-semibold text-slate-700 text-center">
                    {partner.name}
                  </div>
                </div>
              );

              return (
                <ScrollReveal key={partner.id} delay={i * 80}>
                  {partner.website_url ? (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 text-center py-16">
            <p className="text-lg text-slate-500">
              Partners will be announced soon. Stay tuned!
            </p>
          </div>
        )}

        <ScrollReveal delay={200}>
          <div className="mt-16 rounded-3xl border border-black/10 bg-white/70 p-8 text-center">
            <h3 className="text-xl font-bold text-black">
            Become a Partner
          </h3>
          <p className="mt-3 text-sm leading-7 text-black/70">
            We&apos;re always looking for like-minded organizations to collaborate with.
            If you share our vision of empowerment and community development, let&apos;s connect.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Get in touch
          </a>
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
