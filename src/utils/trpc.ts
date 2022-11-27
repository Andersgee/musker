import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { type AppRouter } from "../server/trpc/router/_app";
import { absUrl } from "./url";

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          //experiment a bit with the defaults
          //see https://tanstack.com/query/v4/docs/guides/important-defaults
          queries: {
            staleTime: 10000,
          },
        },
      },
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: absUrl("/api/trpc"),
        }),
      ],
    };
  },
  ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
