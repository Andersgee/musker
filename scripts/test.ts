import "dotenv/config";
import { prisma } from "../src/server/db/client";

async function test1() {
  const sessionUserId = "clb18eoov0007uiqlmopjick6"; //seeduser7
  const totalTake = 100;

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: {
      sentFollows: {
        select: {
          userId: true,
        },
      },
    },
  });

  const followedIds = user?.sentFollows.map((follow) => follow.userId) || [];
  const followedIdsAndMe = [...followedIds, sessionUserId];
  //console.log({ followedIdsAndMe });

  const take = Math.ceil(totalTake / followedIdsAndMe.length);

  const users = await Promise.all(
    followedIdsAndMe.map((id) =>
      prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          tweets: {
            orderBy: { id: "desc" },
            take: take,
            include: {
              author: true,
            },
          },
        },
      }),
    ),
  );
  const tweets = users
    .flatMap((user) => user?.tweets || [])
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  //console.log({ tweets });
  console.log("tweets.length: ", tweets.length);
}

async function test2() {
  const sessionUserId = "clb18eoov0007uiqlmopjick6"; //seeduser7
  const totalTake = 100;

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: {
      sentFollows: {
        select: {
          userId: true,
        },
      },
    },
  });

  const followedIds = user?.sentFollows.map((follow) => follow.userId) || [];
  const followedIdsAndMe = [...followedIds, sessionUserId];
  //console.log({ followedIdsAndMe });

  const tweets = await prisma.tweet.findMany({
    where: {
      authorId: {
        in: followedIdsAndMe,
      },
    },
    orderBy: { id: "desc" },
    take: totalTake,
  });

  //console.log({ tweets });
  console.log("tweets.length: ", tweets.length);
}

async function test3() {
  const sessionUserId = "clb18eoov0007uiqlmopjick6"; //seeduser7
  const totalTake = 100;

  const take = Math.ceil(totalTake / 3);

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: {
      sentFollows: {
        select: {
          user: {
            select: {
              tweets: {
                orderBy: { id: "desc" },
                take: take,
              },
            },
          },
        },
      },
    },
  });
  const tweets = user?.sentFollows.flatMap((follow) => follow.user.tweets) || [];

  //console.log({ tweets });
  console.log("tweets.length: ", tweets.length);
}

test3();
/*
before
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 110   |
| Handler_read_key      | 883   |
| Handler_read_last     | 0     |
| Handler_read_next     | 22719 |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 712   |
| Handler_read_rnd_next | 29862 |
+-----------------------+-------+

after
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 112   |
| Handler_read_key      | 1144  |
| Handler_read_last     | 0     |
| Handler_read_next     | 22746 |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 967   |
| Handler_read_rnd_next | 31423 |
+-----------------------+-------+

*/

/*
test1();

before
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 103   |
| Handler_read_key      | 171   |
| Handler_read_last     | 0     |
| Handler_read_next     | 22628 |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 17    |
| Handler_read_rnd_next | 24469 |
+-----------------------+-------+


after
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 106   |
| Handler_read_key      | 519   |
| Handler_read_last     | 0     |
| Handler_read_next     | 22665 |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 357   |
| Handler_read_rnd_next | 26030 |
+-----------------------+-------+
*/

/*
test2();

before
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 106   |
| Handler_read_key      | 519   |
| Handler_read_last     | 0     |
| Handler_read_next     | 22665 |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 357   |
| Handler_read_rnd_next | 26740 |
+-----------------------+-------+

after
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 108   |
| Handler_read_key      | 622   |
| Handler_read_last     | 0     |
| Handler_read_next     | 22692 |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 457   |
| Handler_read_rnd_next | 28301 |
+-----------------------+-------+
*/
