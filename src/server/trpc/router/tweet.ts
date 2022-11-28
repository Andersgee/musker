import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
//import { type Prisma } from "@prisma/client";

export const tweet = router({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });
    }),
  reply: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
        text: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.create({
        data: {
          repliedToTweetId: input.tweetId,
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweetLike.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.session.user.id,
        },
      });
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweetLike.delete({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.retweet.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.session.user.id,
        },
      });
    }),
  unretweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.retweet.delete({
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
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
});