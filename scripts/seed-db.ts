import "dotenv/config";
import { prisma } from "../src/server/db/client";
import { type Prisma } from "@prisma/client";
import { randInt, randomDate, randomText, randUniqueInts, uniqueWords } from "./lorem";

const N_USERS = 10;
const N_TWEETS_PER_USER = 5;
const N_TWEETREPLIES_PER_USER = 40;
const N_TWEETLIKES_PER_USER = 200;
const N_RETWEETS_PER_USER = 50;

type Users = Prisma.UserCreateManyInput[];
type UserBios = Prisma.UserBioCreateManyInput[];
type Tweets = Prisma.TweetCreateManyInput[];
type TweetLikes = Prisma.TweetLikeCreateManyInput[];
type Retweets = Prisma.RetweetCreateManyInput[];
type Follows = Prisma.FollowCreateManyInput[];

function createdAt() {
  return undefined; //db default is now()
  //return randomDate() //for debug
}

async function createUsers() {
  const users: Users = [];
  for (let i = 0; i < N_USERS; i++) {
    users.push({
      name: `seeduser${i}`,
      email: `seeduser${i}@some.org`,
      //image: "https://randomsvgface.andyfx.net",
      image: `/seeduser/avatar${i}.svg`,
    });
  }
  return await prisma.user.createMany({ data: users });
}

async function createBios() {
  const users = await prisma.user.findMany();
  const userBios: UserBios = users.map((user) => ({
    userId: user.id,
    text: randomText(),
  }));
  return await prisma.userBio.createMany({ data: userBios });
}

async function createHandles() {
  const users = await prisma.user.findMany();
  const names = uniqueWords(users.length);
  users.forEach(async (user, i) => {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        handle: names[i],
      },
    });
  });
}

async function createTweets() {
  const users = await prisma.user.findMany();
  const tweets: Tweets = [];
  for (const user of users) {
    for (let i = 0; i < N_TWEETS_PER_USER; i++) {
      tweets.push({
        authorId: user.id,
        text: randomText(),
        createdAt: createdAt(),
      });
    }
  }
  return await prisma.tweet.createMany({ data: tweets });
}

async function createTweetReplies() {
  const users = await prisma.user.findMany();
  const tweets = await prisma.tweet.findMany();

  for (const user of users) {
    for (let i = 0; i < N_TWEETREPLIES_PER_USER; i++) {
      const repliedToTweetId = tweets[randInt(tweets.length)]!.id;
      await prisma.tweet.create({
        data: {
          repliedToTweetId,
          authorId: user.id,
          text: randomText(),
          createdAt: createdAt(),
        },
      });
      await prisma.tweet.update({
        where: {
          id: repliedToTweetId,
        },
        data: {
          repliesCount: {
            increment: 1,
          },
        },
      });
    }
  }
}

async function createTweetLikes() {
  const users = await prisma.user.findMany();
  const tweets = await prisma.tweet.findMany();

  //const tweetLikes: TweetLikes = [];
  for (const user of users) {
    const userId = user.id;
    const indexes = randUniqueInts(tweets.length, N_TWEETLIKES_PER_USER);

    for (const i of indexes) {
      const tweetId = tweets[i]!.id;
      await prisma.tweetLike.create({
        data: {
          userId,
          tweetId,
          createdAt: createdAt(),
        },
      });
      await prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });
    }
  }
}

async function createRetweets() {
  const users = await prisma.user.findMany();
  const tweets = await prisma.tweet.findMany();

  //const retweets: Retweets = [];
  for (const user of users) {
    const userId = user.id;
    const indexes = randUniqueInts(tweets.length, N_RETWEETS_PER_USER);
    for (const i of indexes) {
      const tweetId = tweets[i]!.id;
      await prisma.retweet.create({
        data: {
          userId: userId,
          tweetId,
          createdAt: createdAt(),
        },
      });
      await prisma.tweet.update({
        where: {
          id: tweetId,
        },
        data: {
          retweetsCount: {
            increment: 1,
          },
        },
      });
    }
  }
  //return await prisma.retweet.createMany({ data: retweets });
}

async function createFollows() {
  const users = await prisma.user.findMany();

  //const follows: Follows = [];
  let userIndex = 0;
  for (const user of users) {
    const indexes = randUniqueInts(users.length, 3).filter((int) => int !== userIndex);
    userIndex += 1;

    for (const i of indexes) {
      const userId = users[i]!.id;
      const followerId = user.id;
      await prisma.follow.create({
        data: {
          userId,
          followerId,
        },
      });
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          recievedFollowsCount: {
            increment: 1,
          },
        },
      });
      await prisma.user.update({
        where: {
          id: followerId,
        },
        data: {
          sentFollowsCount: {
            increment: 1,
          },
        },
      });
    }
  }
  //return await prisma.follow.createMany({ data: follows });
}

/**
 * must have "type": "module" in package.json
 * also see package.json script tsnode
 * ```sh
 * yarn tsnode scripts/seed-db.ts
 * ```
 */
async function main() {
  await createUsers();
  await createBios();
  await createHandles();
  await createTweets();

  await createTweetReplies();
  await createTweetReplies();

  await createTweetLikes();
  await createRetweets();

  await createFollows();
}

main();
