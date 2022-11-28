import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const explore = router({
  tweets: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;

      const items = await ctx.prisma.tweet.findMany({
        orderBy: { createdAt: "desc" },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: limit + 1,
        //where: {authorId: userId},
        include: {
          _count: {
            select: { replies: true, retweets: true, likes: true },
          },
          author: true,
          repliedToTweet: {
            select: {
              id: true,
              author: {
                select: {
                  handle: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
