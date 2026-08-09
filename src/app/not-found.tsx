import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="text-3xl font-semibold text-white">Page not found</div>
        <div className="mt-3 text-sm leading-7 text-white/70">
          The page you are looking for does not exist.
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}

