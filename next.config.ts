import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "open.api.nexon.com",
      },
      {
        protocol: "https",
        hostname: "avatar.maplestory.nexon.com",
      },
      {
        protocol: "https",
        hostname: "*.nexon.com",
      },
    ],
  },
};

export default nextConfig;
