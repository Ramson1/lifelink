import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { brand } from "@/lib/brand";
import { getManyContent } from "@/lib/content";
import { Mail, ArrowRight } from "lucide-react";

export default async function ContactPage() {
  const c = await getManyContent([
    { key: "contact.email", fallback: brand.contact.email },
    { key: "contact.address", fallback: brand.contact.address },
    { key: "contact.phones", fallback: brand.contact.phones.join(", ") },
  ]);

  const email = c["contact.email"];
  const address = c["contact.address"];
  const phones = c["contact.phones"].split(",").map((p) => p.trim()).filter(Boolean);

  return (
    <div className="pt-28 pb-14 sm:pt-32 sm:pb-18">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Contact"
              title="Let’s talk about membership or partnerships"
              description="Send a message and our team will respond with next steps for membership, partnerships, or your preferred sector."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
                <div className="text-sm font-semibold text-black">Headquarters</div>
                <div className="mt-2 text-sm leading-7 text-black/70">
                  {address}
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
                <div className="text-sm font-semibold text-black">Email</div>
                <a
                  className="mt-2 inline-flex text-sm leading-7 text-black/70 underline underline-offset-4 hover:text-black"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
                <div className="mt-4 text-sm font-semibold text-black">Registration</div>
                <a
                  className="mt-1 inline-flex text-sm font-semibold text-black underline underline-offset-4"
                  href="/register"
                >
                  Go to e-registration
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
              <div className="text-sm font-semibold text-black">Phone lines</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-sm text-black/70 hover:text-black"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/70 p-7">
            <div className="text-lg font-semibold text-black">Need help?</div>
            <div className="mt-2 text-sm leading-relaxed text-black/70">
              Have a question or need assistance? Reach out to our customer support team — we&apos;re here to help and usually respond within 24–48 hours.
            </div>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent("Support Request — LifeLink Group")}&body=${encodeURIComponent(`Dear LifeLink Group Support Team,

My name is [Your Name].

I would like to reach out regarding:

[Please type your message here]

Thank you.
`)}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              <Mail className="h-4 w-4" />
              Message Customer Support
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
