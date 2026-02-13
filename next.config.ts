import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://naanews:1x1NtEwVzaimURIP@naanews.fwjwrgo.mongodb.net/?appName=Naanews",
  },
};

export default nextConfig;
