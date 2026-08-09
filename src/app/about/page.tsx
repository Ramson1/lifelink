import Image from "next/image";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { brand, services } from "@/lib/brand";
import { getManyContent } from "@/lib/content";

export default async function AboutPage() {
  const c = await getManyContent([
    { key: "about.intro", fallback: brand.intro },
    { key: "about.mission", fallback: brand.mission },
    { key: "about.vision", fallback: brand.vision },
  ]);

  return (
    <div className="pt-28 pb-14 sm:pt-32 sm:pb-18">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <SectionHeading
            eyebrow="About"
            title={brand.name}
            description={c["about.intro"]}
          />

          <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
            <div className="flex items-center gap-4">
              <Image
                src="/branding/LOGO.png"
                alt="LifeLink logo"
                width={56}
                height={56}
              />
              <div>
                <div className="text-sm font-semibold text-black">
                  {brand.shortName}
                </div>
                <div className="text-sm text-black/70">{brand.tagline}</div>
              </div>
            </div>
            <div className="mt-6 text-sm leading-7 text-black/70">
              {brand.about}
            </div>
            <div className="mt-6 grid gap-2">
              <div className="text-sm font-semibold text-black">Core values</div>
              <div className="flex flex-wrap gap-2">
                {brand.values.map((v) => (
                  <div
                    key={v}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70"
                  >
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white/70 p-7">
            <div className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
              Mission
            </div>
            <div className="mt-3 text-base leading-7 text-black/80">
              {c["about.mission"]}
            </div>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white/70 p-7">
            <div className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
              Vision
            </div>
            <div className="mt-3 text-base leading-7 text-black/80">
              {c["about.vision"]}
            </div>
          </div>
        </div>

        {/* Why Choose */}
        <div className="mt-14">
          <SectionHeading
            eyebrow="Why choose LifeLink"
            title="Built on trust, structure, and impact"
            description="Over two decades of measurable results across communities, families, and businesses."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brand.whyChoose.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-black/10 bg-white/70 p-6 transition hover:bg-white"
              >
                <div className="text-sm font-semibold text-black">{item.title}</div>
                <div className="mt-2 text-sm leading-6 text-black/70">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sectors */}
        <div className="mt-14">
          <SectionHeading
            eyebrow="What we do"
            title="Diverse sectors under one platform"
            description="From humanitarian services and finance to agriculture, energy, and digital assets, our sectors are designed to empower people and communities."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.key}
                className="rounded-3xl border border-black/10 bg-white/70 p-6 transition hover:bg-white"
              >
                <div className="text-sm font-semibold text-black">{s.title}</div>
                <div className="mt-2 text-sm text-black/70">{s.subtitle}</div>
                <div className="mt-4 space-y-2 text-sm text-black/70">
                  {s.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder message */}
        <div className="mt-14 rounded-3xl border border-black/10 bg-white/70 p-8">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            A message from the CEO
          </div>
          <p className="mt-4 text-base leading-8 text-black/80">
            For over two decades, LifeLink has remained steadfast in its mission of
            creating opportunities, promoting economic empowerment, advancing
            humanitarian services, and building sustainable structures that improve
            the quality of life for individuals, families, and communities. We
            believe poverty can be reduced when people are given access to
            opportunities, knowledge, resources, and a supportive community.
          </p>
          <div className="mt-6">
            <div className="text-sm font-semibold text-black">
              {brand.founder.name}
            </div>
            <div className="text-sm text-black/70">{brand.founder.role}</div>
            <div className="mt-2 text-sm italic text-black/60">
              “{brand.tagline}.” We are LifeLinkers.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
