import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dxg4uc5zd5r5g.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
