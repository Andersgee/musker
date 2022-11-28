import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const profile = router({
  tweets: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          tweets: {
            orderBy: { createdAt: "desc" },
            cursor: input.cursor ? { id: input.cursor } : undefined,
            take: limit + 1,
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
          },
        },
      });
      const items = user?.tweets || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),

  tweetsWithoutReplies: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          tweets: {
            where: {
              repliedToTweetId: null,
            },
            orderBy: { createdAt: "desc" },
            cursor: input.cursor ? { id: input.cursor } : undefined,
            take: limit + 1,
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
          },
        },
      });
      const items = user?.tweets || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),

  likes: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;
      const userId = input.userId;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          tweetLikes: {
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_tweetId: {
                    userId: userId,
                    tweetId: input.cursor,
                  },
                }
              : undefined,
            include: {
              tweet: {
                include: {
                  _count: {
                    select: { replies: true, retweets: true, likes: true },
                  },
                  author: true,
                },
              },
            },
          },
        },
      });
      const items = user?.tweetLikes || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.tweetId;
      }
      return { items, nextCursor };
    }),
});
