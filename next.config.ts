import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.winaclaim.com/api/:path*", // backend proxy
      },
    ];
  },
};

export default nextConfig;
