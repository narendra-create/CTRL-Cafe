import type { NextConfig } from "next";

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "www.pexels.com"
      }
    ],
  },
  allowedDevOrigins
};

export default nextConfig;
