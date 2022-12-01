import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const user = router({
  isFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const follow = await ctx.prisma.follow.findUnique({
        where: {
          userId_followerId: {
            followerId: ctx.session.user.id,
            userId: input.userId,
          },
        },
      });
      if (follow) return true;
      return false;
    }),
  follow: protectedProcedure.input(z.object({ userId: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = input.userId;
    const followerId = ctx.session.user.id;
    const create = ctx.prisma.follow.create({
      data: { userId, followerId },
    });
    const update1 = ctx.prisma.user.update({
      where: { id: userId },
      data: { recievedFollowsCount: { increment: 1 } },
    });
    const update2 = ctx.prisma.user.update({
      where: { id: followerId },
      data: { sentFollowsCount: { increment: 1 } },
    });
    const [follow] = await Promise.all([create, update1, update2]);
    return follow;
  }),
  unfollow: protectedProcedure.input(z.object({ userId: z.string() })).mutation(async ({ input, ctx }) => {
    const userId = input.userId;
    const followerId = ctx.session.user.id;
    const del = ctx.prisma.follow.delete({
      where: { userId_followerId: { userId, followerId } },
    });
    const update1 = ctx.prisma.user.update({
      where: { id: userId },
      data: { recievedFollowsCount: { decrement: 1 } },
    });
    const update2 = ctx.prisma.user.update({
      where: { id: followerId },
      data: { sentFollowsCount: { decrement: 1 } },
    });
    const [follow] = await Promise.all([del, update1, update2]);
    return follow;
  }),
  myHandle: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { handle: true },
    });
    return user?.handle;
  }),
});
