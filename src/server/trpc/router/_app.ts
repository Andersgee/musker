import { router } from "../trpc";
import { handle } from "./handle";
import { explore } from "./explore";
import { tweet } from "./tweet";
import { user } from "./user";

export const appRouter = router({
  handle,
  explore,
  tweet,
  user,
});

// export type definition of API
export type AppRouter = typeof appRouter;
