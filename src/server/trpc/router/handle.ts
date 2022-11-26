import { revalidate } from "src/server/common/revalidate";
import { z } from "zod";

import { router, protectedProcedure, publicProcedure } from "../trpc";

export const handle = router({
  debugcreate: publicProcedure
    .input(
      z.object({
        path: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      //1. do some query
      //2. and then if new path is created, revalidate
      const revalRes = await revalidate(input.path);
      return "hello";
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
      }),
    )
    .mutation(({ input, ctx }) => {
      //create is same as update
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          handle: input.text,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          handle: input.text,
        },
      });
    }),
  getMy: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        handle: true,
      },
    });
    return user?.handle;
  }),
  getByText: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          handle: input.text,
        },
        select: {
          handle: true,
        },
      });
      return user?.handle;
    }),
});
