import "dotenv/config";
//import { prisma } from "../src/server/db/client";

async function main() {
  //await prisma.tweet.deleteMany({});
}

main();

/*
actually this will usually not work on planetscale because schema onDelete cant be cascade...
so just do manual querys:
```sh

pscale shell musker main

SHOW TABLES;

delete from Tweet;

etc
```
*/
