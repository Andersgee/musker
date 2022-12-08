// @ts-check
import { withSuperjson } from "next-superjson";
import { withPlausibleProxy } from "next-plausible";
import withBundleAnalyzer from "@next/bundle-analyzer";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "/avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};
export default bundleAnalyzer(withPlausibleProxy()(withSuperjson()(config)));
