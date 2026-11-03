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
    remotePatterns: [
      // Cloudinary assets returned by /api/*/upload routes (see src/lib/storage/cloudinary.ts).
      // Hostname is Cloudinary's canonical CDN delivery domain; any cloud_name is allowed.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
