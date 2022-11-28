import { prisma } from "src/server/db/client";
import { numberFromHashid } from "src/utils/hashids";

export async function getUserByHandle(handle: string) {
  return await prisma.user.findUnique({
    where: { handle },
    include: {
      bio: true,
      _count: {
        select: {
          sentFollows: true,
          recievedFollows: true,
        },
      },
    },
  });
}

export async function getTweetById(id: number) {
  return await prisma.tweet.findUnique({
    where: { id },
    include: {
      _count: {
        select: { replies: true, retweets: true, likes: true },
      },
      author: true,
      repliedToTweet: {
        select: {
          id: true,
          author: {
            select: {
              handle: true,
            },
          },
        },
      },
    },
  });
}

export async function getTweetByHashId(hashId: string) {
  const id = numberFromHashid(hashId);
  if (!id) {
    return null;
  }
  return await prisma.tweet.findUnique({
    where: { id },
    include: {
      _count: {
        select: { replies: true, retweets: true, likes: true },
      },
      author: true,
      repliedToTweet: {
        select: {
          id: true,
          author: {
            select: {
              handle: true,
            },
          },
        },
      },
    },
  });
}
