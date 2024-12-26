import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/kc-development-tools",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
