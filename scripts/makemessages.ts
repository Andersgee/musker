import "dotenv/config";
import { prisma } from "../src/server/db/client";

const andersId = "clb5cem6q0000uimu0r9bar3e";
const seeduser6Id = "clb56gfqa0006ui52znl1knf5";

async function addUserToConversation(userId: string, conversationId: number) {
  return await prisma.usersConversationsPivot.create({
    data: {
      userId,
      conversationId,
    },
  });
}

async function createConversation() {
  return await prisma.conversation.create({ data: {} });
}

async function main() {
  const conversation = await createConversation();
  await addUserToConversation(seeduser6Id, conversation.id);
  await addUserToConversation(andersId, conversation.id);

  const message1 = await prisma.message.create({
    data: {
      senderId: seeduser6Id,
      conversationId: conversation.id,
      text: "hello there.. this message came from seeduser6",
    },
  });

  const message2 = await prisma.message.create({
    data: {
      senderId: andersId,
      conversationId: conversation.id,
      text: "this message is from me :D",
    },
  });

  const seeduser6 = await prisma.user.findUnique({
    where: { id: seeduser6Id },
  });

  const message3 = await prisma.message.create({
    data: {
      senderId: seeduser6Id,
      conversationId: conversation.id,
      text: `ok, btw my handle is ${seeduser6?.handle}`,
    },
  });
}

main();
