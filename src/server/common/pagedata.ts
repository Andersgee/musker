import { prisma } from "src/server/db/client";
import { numberFromHashid } from "src/utils/hashids";

export async function getUserByHandle(handle: string) {
  return await prisma.user.findUnique({ where: { handle } });
}

export async function getTweetById(id: number) {
  return await prisma.tweet.findUnique({ where: { id } });
}

export async function getTweetByHashId(hashId: string) {
  const id = numberFromHashid(hashId);
  if (!id) {
    return null;
  }
  return await prisma.tweet.findUnique({ where: { id } });
}
