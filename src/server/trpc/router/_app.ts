import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { handle } from "./handle";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  handle,
});

// export type definition of API
export type AppRouter = typeof appRouter;
