import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

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

      await ctx.prisma.conversation.update({
        where: { id: input.conversationId },
        data: { lastActivityAt: message.createdAt },
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
      //TODO, this should use cursor and infinite query.
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
      const conversations = user?.conversations.map((c) => c.conversation) || [];
      return conversations.sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
    }),
  conversationMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = 30;

      const usersConversationsPivot = await ctx.prisma.usersConversationsPivot.findUnique({
        where: {
          userId_conversationId: {
            userId: ctx.session.user.id,
            conversationId: input.conversationId,
          },
        },
        select: {
          conversation: {
            select: {
              messages: {
                orderBy: {
                  id: "desc",
                },
                cursor: input.cursor ? { id: input.cursor } : undefined,
                take: limit + 1,
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

      const items = usersConversationsPivot?.conversation.messages || [];

      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); //dont return the one extra
        nextCursor = nextItem?.id;
      }
      return { items, nextCursor };
    }),

  conversationUsers: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const usersConversationsPivot = await ctx.prisma.usersConversationsPivot.findUnique({
        where: {
          userId_conversationId: {
            userId: ctx.session.user.id,
            conversationId: input.conversationId,
          },
        },
        select: {
          conversation: {
            select: {
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
            },
          },
        },
      });

      const users = usersConversationsPivot?.conversation.users || [];
      return users;
    }),
});
