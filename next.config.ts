import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      // Allow all local images. `search` is intentionally OMITTED: Next
      // compares a defined `search` by exact equality, which would reject the
      // ?v=<mtime> cache-buster appended to team photos (see src/lib/team.ts).
      // Omitting it skips the query check while still restricting to local.
      { pathname: "**" },
    ],
  },
};

export default nextConfig;
