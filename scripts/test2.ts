import "dotenv/config";
import { dbfetch } from "../src/server/db";

async function main() {
  const users = await dbfetch().selectFrom("User").selectAll().execute();
  console.log(users);
}

main();
