import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const message = router({
  create: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({
        data: {
          senderId: ctx.session.user.id,
          conversationId: input.conversationId,
          text: input.text,
        },
      });
      return message;
    }),
  conversations: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          conversations: {
            select: {
              conversation: {
                include: {
                  users: {
                    select: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return user?.conversations.map((c) => c.conversation);
    }),
  messages: protectedProcedure
    .input(
      z.object({
        conversationId: z.number().nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (input.conversationId == null) return undefined;

      const usersConversationsPivot = await ctx.prisma.usersConversationsPivot.findUnique({
        where: {
          userId_conversationId: {
            userId: ctx.session.user.id,
            conversationId: input.conversationId,
          },
        },
        select: {
          conversation: {
            include: {
              messages: {
                orderBy: {
                  id: "desc",
                },
                include: {
                  sender: {
                    select: {
                      handle: true,
                      image: true,
                    },
                  },
                },
              },
              users: true,
            },
          },
        },
      });
      return usersConversationsPivot?.conversation;
    }),
});
