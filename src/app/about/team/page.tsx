import Image from "next/image";
import {
  Brain,
  BriefcaseBusiness,
  ClipboardCheck,
  Crown,
  Flame,
  Handshake,
  HeartHandshake,
  Megaphone,
  Network,
  Quote,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Container } from "@/components/Container";
import { GradientOrbs } from "@/components/GradientOrbs";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";
import { listTeamMembers, type TeamMember } from "@/lib/team";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    title: `Our Team — ${brand.shortName}`,
    description:
      "Meet the leadership team driving LifeLink Group's mission to empower individuals and transform communities.",
  };
}

const CEO_ROLES = [
  { label: "Entrepreneur", icon: Rocket },
  { label: "Business Consultant / Leader", icon: BriefcaseBusiness },
  { label: "Networker", icon: Network },
  { label: "Grassroot Mobilizer", icon: Megaphone },
  { label: "Investment Expert", icon: TrendingUp },
  { label: "Humanitarian", icon: HeartHandshake },
  { label: "Mindset Coach", icon: Brain },
  { label: "Professional Coordinator / Organizer", icon: ClipboardCheck },
  { label: "Revivalist", icon: Flame },
  { label: "Team Builder & Negotiator", icon: Handshake },
];

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
          {/* Gradient overlay — solid dark base to guarantee white name */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
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
                    {/* Photo + Name Header */}
                    <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 pt-10 pb-8 sm:pt-14 sm:pb-10 text-white">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative h-56 w-56 flex-none overflow-hidden rounded-full border-4 border-white/30 bg-white/10 shadow-2xl">
                          <Image
                            src={ceo.image}
                            alt={ceo.name}
                            fill
                            sizes="224px"
                            className="object-cover object-[50%_30%]"
                          />
                        </div>
                        <div className="mt-6">
                          <div className="text-2xl sm:text-3xl font-extrabold leading-tight">
                            {ceo.name}
                          </div>
                          <div className="mt-1 text-base font-semibold text-white/80">
                            {ceo.position}
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            {brand.name}
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
                            He is a Nigerian and the lead minister of Motivational Movement Community &mdash; an online prayer and mentor ministry.
                          </p>
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Through his group, many people have gained spiritually, physically, financially, and materially over the last two decades. Pastor Obi Nwagbo loves to see people smile through his contributions and efforts, and his desire for empowerment is excellent.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile / Roles */}
                    <div className="border-b border-slate-200 px-8 py-8 dark:border-slate-700 sm:px-10">
                      <div className="mb-5 flex items-center gap-3">
                        <Sparkles className="h-5 w-5 flex-none text-indigo-600" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile / Roles</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/40 to-transparent" />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {CEO_ROLES.map(({ label, icon: Icon }) => (
                          <div
                            key={label}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-indigo-300 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800"
                          >
                            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

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
                        <p className="text-base leading-8 text-slate-700">Through our <strong>Project 2030 Vision</strong>, we are pursuing ambitious goals that include:</p>
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
                        As we look toward the future, we invite individuals, organizations, investors, development partners, and community leaders to join us in creating lasting impact. Together, we can build one of Africa&apos;s largest and most effective community-based organizations while improving lives and creating opportunities for generations to come.
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
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
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
