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
};
export default bundleAnalyzer(withPlausibleProxy()(withSuperjson()(config)));
