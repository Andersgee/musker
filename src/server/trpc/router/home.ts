import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const home = router({
  tweets: protectedProcedure
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
              _count: {
                select: {
                  likes: true,
                  replies: true,
                  retweets: true,
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
                      _count: {
                        select: {
                          likes: true,
                          replies: true,
                          retweets: true,
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
