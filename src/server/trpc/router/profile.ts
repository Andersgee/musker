import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const profile = router({
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

      const userWithTweets = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          tweets: {
            where: {
              repliedToTweetId: null,
            },
            orderBy: { createdAt: "desc" },
            cursor: input.cursor?.tweetCursor ? { id: input.cursor.tweetCursor } : undefined,
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
      const tweets = userWithTweets?.tweets || [];

      const userWithRetweets = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
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
          },
        },
      });
      const retweets = userWithRetweets?.retweets || [];

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

      //return a single list of tweets... need to sort it again
      //const tweets = tweets1.concat(tweets2).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      return {
        items: { tweets, retweets },
        nextCursor: tweetCursor || retweetCursor ? { tweetCursor, retweetCursor } : undefined,
      };
    }),
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

      const userWithTweets = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          tweets: {
            orderBy: { createdAt: "desc" },
            cursor: input.cursor?.tweetCursor ? { id: input.cursor.tweetCursor } : undefined,
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
      const tweets = userWithTweets?.tweets || [];

      const userWithRetweets = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
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
          },
        },
      });
      const retweets = userWithRetweets?.retweets || [];

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

      //return a single list of tweets... need to sort it again
      //const tweets = tweets1.concat(tweets2).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      return {
        items: { tweets, retweets },
        nextCursor: tweetCursor || retweetCursor ? { tweetCursor, retweetCursor } : undefined,
      };
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
});
