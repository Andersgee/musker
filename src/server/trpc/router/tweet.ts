import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const tweet = router({
  actionCounts: publicProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tweet = await ctx.prisma.tweet.findUnique({
        where: {
          id: input.tweetId,
        },
        select: {
          repliesCount: true,
          retweetsCount: true,
          likesCount: true,
        },
      });
      return tweet;
    }),

  create: protectedProcedure
    .input(
      z.object({
        text: z.string().max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tweet = await ctx.prisma.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });

      /*
      const hashId = hashidFromNumber(tweet.id);
      const handle = tweet.author.handle;
      const path = `/${handle}/${hashId}`;
      console.log(`tweet.create, revalidate(${path})`);
      revalidate(path);
      */
      return tweet;
    }),
  reply: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
        text: z.string().max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const create = ctx.prisma.tweet.create({
        data: {
          repliedToTweetId: input.tweetId,
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });
      const update = ctx.prisma.tweet.update({
        where: { id: input.tweetId },
        data: { repliesCount: { increment: 1 } },
        select: { id: true },
      });
      const [tweet] = await Promise.all([create, update]);
      return tweet;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.delete({
        where: { id: input.tweetId },
      });
    }),
  like: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const create = ctx.prisma.tweetLike.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.session.user.id,
        },
      });
      const update = ctx.prisma.tweet.update({
        where: { id: input.tweetId },
        data: { likesCount: { increment: 1 } },
        select: { id: true },
      });
      const [like] = await Promise.all([create, update]);
      return like;
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const del = ctx.prisma.tweetLike.delete({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
      const update = ctx.prisma.tweet.update({
        where: { id: input.tweetId },
        data: { likesCount: { decrement: 1 } },
        select: { id: true },
      });
      const [like] = await Promise.all([del, update]);
      return like;
    }),
  hasLiked: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existingLike = await ctx.prisma.tweetLike.findUnique({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
      if (existingLike) {
        return true;
      }
      return false;
    }),
  retweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const create = ctx.prisma.retweet.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.session.user.id,
        },
      });

      const update = ctx.prisma.tweet.update({
        where: { id: input.tweetId },
        data: { retweetsCount: { increment: 1 } },
        select: { id: true },
      });
      const [retweet] = await Promise.all([create, update]);
      return retweet;
    }),
  unretweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const del = ctx.prisma.retweet.delete({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
      const update = ctx.prisma.tweet.update({
        where: { id: input.tweetId },
        data: { retweetsCount: { decrement: 1 } },
        select: { id: true },
      });
      const [retweet] = await Promise.all([del, update]);
      return retweet;
    }),
  hasRetweeted: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existingRetweet = await ctx.prisma.retweet.findUnique({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
      if (existingRetweet) {
        return true;
      }
      return false;
    }),

  replies: publicProcedure
    .input(
      z.object({
        tweetId: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = 30;

      const tweet = await ctx.prisma.tweet.findUnique({
        where: {
          id: input.tweetId,
        },
        select: {
          replies: {
            orderBy: { id: "desc" },
            take: limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            include: {
              author: true,
            },
          },
        },
      });
      const items = tweet?.replies || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),
});
