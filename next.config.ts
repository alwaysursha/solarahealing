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
