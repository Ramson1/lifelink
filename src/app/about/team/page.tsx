import Image from "next/image";
import { Crown, Quote } from "lucide-react";

import { Container } from "@/components/Container";
import { GradientOrbs } from "@/components/GradientOrbs";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CeoRoles } from "@/components/team/CeoRoles";
import { JsonLd } from "@/components/seo/JsonLd";
import { brand } from "@/lib/brand";
import { listTeamMembers, type TeamMember } from "@/lib/team";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Our Team",
  description:
    "Meet the leadership team driving LifeLink Group's mission to empower individuals and transform communities.",
  path: "/about/team",
});

function MemberCard({ member }: { member: TeamMember }) {
  const safeId = member.name.replace(/[^a-zA-Z0-9]/g, "");
  return (
    <article className="group relative cursor-pointer">
      {/* Bookmark ribbon container */}
      <div className="relative overflow-hidden rounded-t-2xl bg-white shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl dark:bg-slate-800">
        {/* Photo */}
        <div className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-[2/3]">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay — softened for brighter photos; white name stays readable via drop-shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Name on image */}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-4 pt-8 text-center">
            <h3 className="text-sm font-bold leading-tight drop-shadow-lg" style={{ color: "#ffffff" }}>
              {member.name}
            </h3>
          </div>
        </div>

        {/* Position strip */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-cyan-600 px-3 py-3 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wide leading-tight text-white/95">
            {member.position}
          </p>
        </div>
      </div>

      {/* Bookmark V-notch tail */}
      <div className="relative h-5" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="h-full w-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id={`bm-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(79 70 229)" />
              <stop offset="100%" stopColor="rgb(8 145 178)" />
            </linearGradient>
          </defs>
          <polygon
            points="0,0 100,0 50,20"
            fill={`url(#bm-${safeId})`}
          />
        </svg>
      </div>
    </article>
  );
}

export default function TeamPage() {
  const excludedNames = ["kingley iroka", "obi nwagbo"];
  const members = listTeamMembers().filter(
    (m) => m.level !== "ceo" && !excludedNames.some((n) => m.name.toLowerCase().includes(n)),
  );
  const ceos = listTeamMembers().filter((m) => m.level === "ceo");

  return (
    <div className="min-h-screen">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Our Team", path: "/about/team" },
        ])}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 sm:py-24 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <GradientOrbs variant="cool" />
        <Container className="relative">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">Leadership</div>
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                Meet the team behind LifeLink
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                The people driving our mission to turn ordinary people into extraordinary heroes.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* CEO Section */}
      {ceos.length > 0 && (
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <MeshGradient variant="aurora" />
          <Container>
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-lg ring-4 ring-indigo-500/10">
                  <Crown className="h-7 w-7" />
                </div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                  <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">A Message from the CEO</div>
                  <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Leadership Vision</h2>
              </div>
            </ScrollReveal>

            {ceos.map((ceo) => (
              <ScrollReveal key={ceo.image} delay={100}>
                <div className="mx-auto max-w-4xl">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    {/* CEO Hero Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-600 text-white">
                      {/* Decorative glows */}
                      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                      <div className="relative grid items-center gap-12 p-8 sm:p-10 md:grid-cols-[280px_minmax(0,1fr)] md:gap-10 md:p-12">
                        {/* Portrait */}
                        <div className="relative mx-auto w-fit">
                          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-cyan-300/50 via-white/20 to-transparent blur-2xl" />
                          <div className="relative h-[340px] w-[270px] overflow-hidden rounded-[1.75rem] border-4 border-white/80 shadow-2xl ring-1 ring-white/40 sm:w-[300px]">
                            <Image
                              src={ceo.image}
                              alt={ceo.name}
                              fill
                              sizes="(max-width: 768px) 270px, 300px"
                              className="object-cover object-[50%_22%]"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-indigo-900/70 to-transparent" />
                          </div>
                          {/* Floating Founder & CEO badge */}
                          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-indigo-700 shadow-xl ring-1 ring-black/5">
                            <Crown className="h-4 w-4" />
                            <span className="text-[11px] font-extrabold uppercase tracking-wider">Founder &amp; CEO</span>
                          </div>
                        </div>

                        {/* Identity */}
                        <div className="text-center md:text-left">
                          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                            Founder &amp; Chief Executive Officer
                          </div>
                          <h3 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl" style={{ color: "#ffffff" }}>
                            {ceo.name}
                          </h3>
                          <div className="mx-auto mt-4 h-1 w-16 rounded bg-gradient-to-r from-cyan-300 to-white/60 md:mx-0" />
                          <p className="mt-4 text-base font-semibold text-white/90">{brand.name}</p>
                          <p className="mt-1 text-sm italic leading-7 text-white/70">
                            {brand.tagline}. WE ARE LIFELINKERS.
                          </p>
                          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                            {["20+ Years of Impact", "Community-Driven", "Faith & Integrity"].map((chip) => (
                              <span
                                key={chip}
                                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm"
                              >
                                {chip}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Founder bio band */}
                    <div className="border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-8 py-8 dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 sm:px-10">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow">
                          <Crown className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-base font-extrabold uppercase leading-snug tracking-wide text-slate-900 dark:text-white sm:text-lg">
                            Pst. Obi Nwagbo is the Founder / CEO of LifeLink Group
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            He is a Nigerian and the lead minister of Motivational Movement Community &mdash; an online prayer ministry.
                          </p>
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Through his group, many people have gained spiritually, physically, financially, and materially over the last two decades. Pastor Obi Nwagbo loves to see people smile through his contributions and efforts, and his desire for empowerment is excellent.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile / Roles */}
                    <CeoRoles />

                    {/* Full Message */}
                    <div className="p-8 sm:p-10 space-y-6">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        Welcome to LIFELINK GROUP INTERNATIONAL LIMITED
                      </div>
                      <div className="text-sm font-semibold text-indigo-600">Dear Friends, Partners, Members, and Visitors,</div>

                      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                        It gives me great pleasure to welcome you to LIFELINK GROUP INTERNATIONAL LIMITED, a dynamic and community-driven organization committed to transforming ordinary people into extraordinary heroes.
                      </p>
                      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                        For over two decades, LIFELINK has remained steadfast in its mission of creating opportunities, promoting economic empowerment, advancing humanitarian services, and building sustainable structures that improve the quality of life for individuals, families, and communities.
                      </p>
                      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                        What began as a Cooperative Society has evolved into a diversified organization with interests in Humanitarian Services, Cooperative Development, Finance, Agriculture, Trade and Investments, Transportation, Land Banking, Information Technology, Digital Assets, Food Security, Affiliate Marketing, Production, and Community Development Projects.
                      </p>
                      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                        At LIFELINK, we believe that poverty can be reduced when people are given access to opportunities, knowledge, resources, and a supportive community. Our commitment is to build a platform where individuals can grow, earn, invest, learn, and contribute meaningfully to society.
                      </p>

                      <div>
                        <p className="text-base leading-8 text-indigo-600 dark:text-indigo-400">Through our <strong>Project 2030 Vision</strong>, we are pursuing ambitious goals that include:</p>
                        <ul className="mt-4 space-y-3">
                          {[
                            "Expanding our humanitarian and grassroots initiatives across Nigeria and beyond.",
                            "Building a membership base of over 20,000 verified members.",
                            "Advancing digital transformation through innovative technology solutions.",
                            "Promoting food security and subsidization programs for millions of people.",
                            "Supporting entrepreneurs through grants, loans, and business development initiatives.",
                            "Providing training in skill acquisition, agriculture, digital assets, and emerging opportunities.",
                            "Facilitating access to land ownership, transportation solutions, and community infrastructure projects.",
                          ].map((goal) => (
                            <li key={goal} className="flex items-start gap-3 text-base leading-8 text-slate-700 dark:text-slate-300">
                              <span className="mt-3 h-2 w-2 flex-none rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                        Our success over the years has been built on three fundamental principles: <strong>Honesty</strong>, <strong>Transparency</strong>, and <strong>Quality Service</strong>. These values continue to guide every decision we make and every relationship we build.
                      </p>
                      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                        As we look toward the future, we invite individuals, organizations, government institutions, investors, development partners, and community leaders to join us in creating lasting impact. Together, we can build one of Africa&apos;s largest and most effective community-based organizations while improving lives and creating opportunities for generations to come.
                      </p>
                      <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                        Thank you for visiting our website and for taking the time to learn more about our vision. We look forward to partnering with you on this remarkable journey.
                      </p>

                      {/* Founder quote */}
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-600 p-8 text-center shadow-lg">
                        <Quote className="mx-auto h-9 w-9 text-white/40" />
                        <p className="mt-3 text-2xl font-extrabold italic leading-snug text-white sm:text-3xl">
                          &ldquo;Kindness is the best investment&rdquo;
                        </p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#ffffff" }}>
                          &mdash; Pst. Obi Nwagbo
                        </p>
                      </div>

                      {/* Signature */}
                      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-white/20">
                        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Warm regards,</div>
                        <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                          PASTOR OBI NWAGBO
                        </div>
                        <div className="text-sm font-semibold text-indigo-600">
                          {brand.founder.role}
                        </div>
                        <div className="text-sm text-slate-500">
                          {brand.name}
                        </div>
                        <div className="mt-2 text-sm italic text-slate-500">
                          &ldquo;{brand.tagline}.&rdquo; WE ARE LIFELINKERS.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </Container>
        </section>
      )}

      {/* Team Members Section */}
      {members.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                  <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">Our People</div>
                  <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Members</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {members.map((m, i) => (
                <ScrollReveal key={m.image} delay={i * 80}>
                  <MemberCard member={m} />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Empty state */}
      {members.length === 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Team members will be listed here soon.
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
