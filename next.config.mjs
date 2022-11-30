// @ts-check
import { withSuperjson } from "next-superjson";
import { withPlausibleProxy } from "next-plausible";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default withPlausibleProxy()(withSuperjson()(config));
