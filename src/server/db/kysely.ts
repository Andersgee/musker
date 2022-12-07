import type { User, Tweet } from "@prisma/client/edge";
//import { env } from "src/env/server.mjs";
import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

interface Database {
  User: User;
  Tweet: Tweet;
  //add things here manually?
}

export const kysely = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
  }),
});
