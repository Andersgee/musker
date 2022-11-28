import { revalidate } from "src/server/common/revalidate";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const handle = router({
  /** create is same as update */
  update: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      //create is same as update
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          handle: input.text,
        },
      });
      revalidate(`/${user.handle}`);
      return user;
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
