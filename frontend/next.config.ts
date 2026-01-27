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
        hostname: "geotech-shop-bucket.s3.eu-south-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
