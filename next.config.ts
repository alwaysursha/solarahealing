import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "jspdf",
    "html2canvas",
    "canvg",
    "dompurify",
  ],
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/articles", permanent: true },
      { source: "/blog/:slug", destination: "/articles/:slug", permanent: true },
      { source: "/admin/blog", destination: "/admin/articles", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.soularahealing.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "soularahealing.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev({ remoteBindings: true });
