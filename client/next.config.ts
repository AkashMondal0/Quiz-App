import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    devIndicators: false,
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
    images: {
      unoptimized: true,
    },
};

export default nextConfig;
