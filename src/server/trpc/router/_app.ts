import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { handle } from "./handle";
import { explore } from "./explore";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  handle,
  explore,
});

// export type definition of API
export type AppRouter = typeof appRouter;
