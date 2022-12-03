import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const message = router({
  createConversation: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //new conversation
      const conversation = await ctx.prisma.conversation.create({ data: {} });
      //add both users

      const participant1 = ctx.prisma.usersConversationsPivot.create({
        data: {
          conversationId: conversation.id,
          userId: ctx.session.user.id,
        },
      });
      const participant2 = ctx.prisma.usersConversationsPivot.create({
        data: {
          conversationId: conversation.id,
          userId: input.userId,
        },
      });
      await Promise.all([participant1, participant2]);
      return conversation;
    }),
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
                  messages: {
                    orderBy: { id: "desc" },
                    take: 1,
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
              users: {
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
            },
          },
        },
      });
      return usersConversationsPivot?.conversation;
    }),
});
