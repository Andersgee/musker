import { Kysely, MysqlAdapter, MysqlIntrospector, MysqlQueryCompiler } from "kysely";
import type { DB } from "./types";
import { FetchDriver, type RequestInitLimited } from "./fetch-driver";
import { JSONE } from "./jsone";

export function dbfetch(init?: RequestInitLimited) {
  return new Kysely<DB>({
    dialect: {
      createAdapter: () => new MysqlAdapter(),
      createIntrospector: (db) => new MysqlIntrospector(db),
      createQueryCompiler: () => new MysqlQueryCompiler(),
      createDriver: () => {
        return new FetchDriver({
          transformer: JSONE,
          url: process.env.DATABASE_HTTP_URL!,
          init: {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: process.env.DATABASE_HTTP_AUTH_HEADER!,
              db: "musker",
            },
            ...init,
          },
        });
      },
    },
  });
}
