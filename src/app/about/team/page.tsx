import Image from "next/image";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { brand } from "@/lib/brand";
import { listTeamMembers } from "@/lib/team";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    title: `Our Team — ${brand.shortName}`,
    description:
      "Meet the leadership team driving LifeLink Group's mission to empower individuals and transform communities.",
  };
}

export default function TeamPage() {
  const members = listTeamMembers();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 sm:py-24">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200 to-cyan-200 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 blur-3xl" />
        </div>
        <Container className="relative">
          <SectionHeading
            eyebrow="Leadership"
            title="Meet the team behind LifeLink"
            description="The people driving our mission to turn ordinary people into extraordinary heroes."
          />
        </Container>
      </section>

      {/* Team grid */}
      <section className="py-16 sm:py-20">
        <Container>
          {members.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Team members will be listed here soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((m) => (
                <article
                  key={m.image}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:shadow-xl"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-base font-bold leading-tight text-slate-900">
                      {m.name}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-indigo-600">
                      {m.position}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
