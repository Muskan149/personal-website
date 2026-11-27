import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async redirects() {
    return [
      // /resume opens the PDF directly. Temporary (307) so browsers don't
      // cache it, in case the resume file name changes later.
      {
        source: "/resume",
        destination:
          "/assets/resume/Mahajan_Muskan_Resume_Full_Stack_Website.pdf",
        permanent: false,
      },
    ];
  },
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
