import { router } from "../trpc";
import { handle } from "./handle";
import { explore } from "./explore";
import { tweet } from "./tweet";
import { user } from "./user";
import { profile } from "./profile";
import { follows } from "./follows";
import { home } from "./home";

export const appRouter = router({
  handle,
  explore,
  profile,
  tweet,
  user,
  follows,
  home,
});

// export type definition of API
export type AppRouter = typeof appRouter;
