import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const home = router({
  tweets: protectedProcedure
    .input(
      z.object({
        cursor: z.record(z.number()).nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 2;
      const sessionUserId = ctx.session.user.id;
      const user = await ctx.prisma.user.findUnique({
        where: { id: sessionUserId },
        select: {
          sentFollows: {
            select: {
              userId: true,
            },
          },
        },
      });
      const followedIds = user?.sentFollows.map((follow) => follow.userId) || [];
      const followedIdsAndMe = [...followedIds, sessionUserId];

      const users = await Promise.all(
        followedIdsAndMe.map((userId) => {
          if (input.cursor == null) {
            //this is the 'first' page, use undefined cursor
            return ctx.prisma.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                tweets: {
                  orderBy: { id: "desc" },
                  take: limit + 1,
                  include: {
                    author: true,
                    repliedToTweet: {
                      select: {
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
          }

          if (input.cursor[userId] !== undefined) {
            //this user has cursor
            return ctx.prisma.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                tweets: {
                  orderBy: { id: "desc" },
                  cursor: { id: input.cursor[userId] },
                  take: limit + 1,
                  include: {
                    author: true,
                    repliedToTweet: {
                      select: {
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
          }

          return null;
        }),
      );

      const nextCursor: Record<string, number> = {};
      for (const user of users) {
        if (!user) continue;

        if (user.tweets.length > limit) {
          const nextItem = user.tweets.pop(); //dont return the one extra
          if (nextItem?.id !== undefined) {
            nextCursor[user.id] = nextItem.id;
          }
        }
      }

      const tweets = users
        .flatMap((user) => user?.tweets || [])
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return { items: tweets, nextCursor };
    }),
  tweetsOld: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sessionUserId = ctx.session.user.id;
      const takeFromEach = 10;

      const user = await ctx.prisma.user.findUnique({
        where: { id: sessionUserId },
        select: {
          //my tweets
          tweets: {
            orderBy: { id: "desc" },
            take: takeFromEach,
            include: {
              author: true,
              repliedToTweet: {
                select: {
                  author: {
                    select: {
                      handle: true,
                    },
                  },
                },
              },
            },
          },
          sentFollows: {
            select: {
              user: {
                select: {
                  //from people I follow
                  tweets: {
                    orderBy: { id: "desc" },
                    take: takeFromEach,
                    include: {
                      author: true,
                      repliedToTweet: {
                        select: {
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
          },
        },
      });
      const tweetsFromFollowed = user?.sentFollows.flatMap((follow) => follow.user.tweets) || [];
      const myTweets = user?.tweets || [];
      const tweets =
        tweetsFromFollowed.concat(myTweets).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || [];

      return tweets;
    }),
});
