import { revalidate } from "src/server/common/revalidate";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const profile = router({
  /**
   * 1. tweets that are not replies
   * 2. retweets
   */
  tweets: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.object({ tweetCursor: z.number().nullish(), retweetCursor: z.number().nullish() }).nullish(),
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
          tweets: {
            orderBy: { id: "desc" },
            where: {
              repliedToTweetId: null,
            },
            cursor: input.cursor?.tweetCursor ? { id: input.cursor.tweetCursor } : undefined,
            take: limit + 1,
            include: {
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
          retweets: {
            orderBy: { createdAt: "desc" },
            cursor: input.cursor?.retweetCursor
              ? {
                  userId_tweetId: {
                    userId: userId,
                    tweetId: input.cursor.retweetCursor,
                  },
                }
              : undefined,
            take: limit + 1,
            include: {
              user: {
                select: {
                  handle: true,
                },
              },
              tweet: {
                include: {
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
          },
        },
      });

      const tweets = user?.tweets || [];
      const retweets = user?.retweets || [];

      let tweetCursor: number | undefined = undefined;
      if (tweets.length > limit) {
        const nextItem = tweets.pop(); //dont return the one extra
        tweetCursor = nextItem?.id;
      }

      let retweetCursor: number | undefined = undefined;
      if (retweets.length > limit) {
        const nextItem = retweets.pop(); //dont return the one extra
        retweetCursor = nextItem?.tweet.id;
      }

      return {
        items: { tweets, retweets },
        nextCursor: tweetCursor || retweetCursor ? { tweetCursor, retweetCursor } : undefined,
      };
    }),
  /**
   * 1. tweets
   * 2. retweets
   */
  tweetsWithReplies: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.object({ tweetCursor: z.number().nullish(), retweetCursor: z.number().nullish() }).nullish(),
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
          tweets: {
            orderBy: { id: "desc" },
            cursor: input.cursor?.tweetCursor ? { id: input.cursor.tweetCursor } : undefined,
            take: limit + 1,
            include: {
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
          retweets: {
            orderBy: { tweetId: "desc" },
            cursor: input.cursor?.retweetCursor
              ? {
                  userId_tweetId: {
                    userId: userId,
                    tweetId: input.cursor.retweetCursor,
                  },
                }
              : undefined,
            take: limit + 1,
            include: {
              user: {
                select: {
                  handle: true,
                },
              },
              tweet: {
                include: {
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
          },
        },
      });

      const tweets = user?.tweets || [];
      const retweets = user?.retweets || [];

      let tweetCursor: number | undefined = undefined;
      if (tweets.length > limit) {
        const nextItem = tweets.pop(); //dont return the one extra
        tweetCursor = nextItem?.id;
      }

      let retweetCursor: number | undefined = undefined;
      if (retweets.length > limit) {
        const nextItem = retweets.pop(); //dont return the one extra
        retweetCursor = nextItem?.tweet.id;
      }

      return {
        items: { tweets, retweets },
        nextCursor: tweetCursor || retweetCursor ? { tweetCursor, retweetCursor } : undefined,
      };
    }),
  /**
   * tweetLikes (with tweet included)
   */
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
            orderBy: { tweetId: "desc" },
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

  followCount: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          recievedFollowsCount: true,
          sentFollowsCount: true,
        },
      });
      return user;
    }),
  updateBio: protectedProcedure
    .input(
      z.object({
        text: z.string().max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bio: {
            upsert: {
              create: {
                text: input.text,
              },
              update: {
                text: input.text,
              },
            },
          },
        },
      });
      await revalidate(`/${user.handle}`);

      return user;
    }),
});
