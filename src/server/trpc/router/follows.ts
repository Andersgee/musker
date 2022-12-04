import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const follows = router({
  mySentFollows: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sessionUserId = ctx.session.user.id;
      const limit = 10;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: sessionUserId,
        },
        select: {
          sentFollows: {
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_followerId: {
                    userId: input.cursor,
                    followerId: sessionUserId,
                  },
                }
              : undefined,
            select: {
              user: {
                select: {
                  id: true,
                  handle: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      const items = user?.sentFollows || [];

      let nextCursor: string | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.user?.id;
      }
      return { items, nextCursor };
    }),
  followers: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId;
      const limit = 30;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          recievedFollows: {
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_followerId: {
                    userId: userId,
                    followerId: input.cursor,
                  },
                }
              : undefined,
            include: {
              follower: true,
            },
          },
        },
      });

      const items = user?.recievedFollows || [];

      let nextCursor: string | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra

        nextCursor = nextItem?.followerId;
      }
      return { items, nextCursor };
    }),
  following: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId;
      const limit = 30;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          sentFollows: {
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_followerId: {
                    userId: input.cursor,
                    followerId: userId,
                  },
                }
              : undefined,
            include: {
              user: true,
            },
          },
        },
      });

      const items = user?.sentFollows || [];

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.userId;
      }
      return { items, nextCursor };
    }),
  /** the followers of userId that I know of (which is the ones I myself follow) */
  knownFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId;
      const limit = 30;

      const myUser = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          sentFollows: {
            select: {
              userId: true,
            },
          },
        },
      });
      const myFollowedIds = myUser?.sentFollows.map((follow) => follow.userId) || [];

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          recievedFollows: {
            where: {
              followerId: {
                in: myFollowedIds,
              },
            },
            take: limit + 1,
            cursor: input.cursor
              ? {
                  userId_followerId: {
                    userId: userId,
                    followerId: input.cursor,
                  },
                }
              : undefined,
            include: {
              follower: true,
            },
          },
        },
      });

      const items = user?.recievedFollows || [];

      let nextCursor: string | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.followerId;
      }
      return { items, nextCursor };
    }),
});
