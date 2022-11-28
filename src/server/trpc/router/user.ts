import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

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

  follow: protectedProcedure.input(z.object({ userId: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.follow.create({
      data: {
        userId: input.userId,
        followerId: ctx.session.user.id,
      },
    });
  }),
  unfollow: protectedProcedure.input(z.object({ userId: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.follow.delete({
      where: {
        userId_followerId: {
          userId: input.userId,
          followerId: ctx.session.user.id,
        },
      },
    });
  }),
  myHandle: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        handle: true,
      },
    });
    return user?.handle;
  }),
});
