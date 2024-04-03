import type { User, Tweet } from "@prisma/client/edge";

export type DB = {
  User: User;
  Tweet: Tweet;
  //add things here manually?
};
