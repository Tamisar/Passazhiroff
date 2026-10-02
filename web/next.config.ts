import type { NextConfig } from "next";

const mediaUrl = new URL(process.env.CMS_MEDIA_URL ?? process.env.CMS_URL ?? "http://localhost:1337");

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [new URL("/uploads/**", mediaUrl)],
    dangerouslyAllowLocalIP: mediaUrl.hostname === "localhost" || mediaUrl.hostname === "127.0.0.1",
  },
};

export default nextConfig;
