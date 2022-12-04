import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const conversation = router({
  inviteToConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const pivot = ctx.prisma.usersConversationsPivot.findUnique({
          where: {
            userId_conversationId: {
              conversationId: input.conversationId,
              userId: ctx.session.user.id,
            },
          },
        });
        //I need to be in this convo
        if (!pivot) return false;

        const invited = await ctx.prisma.usersConversationsPivot.create({
          data: {
            conversationId: input.conversationId,
            userId: input.userId,
          },
        });
        if (!invited) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    }),
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
  myInvitableUsers: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sessionUserId = ctx.session.user.id;
      const limit = 10;

      const conversation = await ctx.prisma.conversation.findUnique({
        where: {
          id: input.conversationId,
        },
        select: {
          users: {
            select: {
              userId: true,
            },
          },
        },
      });
      const alreadyInvitedUsers = conversation?.users.map((user) => user.userId) || [];

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: sessionUserId,
        },
        select: {
          sentFollows: {
            where: {
              userId: {
                notIn: alreadyInvitedUsers,
              },
            },
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
});
