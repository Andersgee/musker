import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { UserLink } from "src/components/Link";
import { Tweet } from "src/components/Tweet";
import { getTweetByHashId, getTweetById, getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Tweet = NonNullable<inferAsyncReturnType<typeof getTweetByHashId>>;

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
  tweets: Tweet[];
};

const Page: NextPage<Props> = ({ user, tweets }) => {
  const router = useRouter();
  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <UserLink userHandle={user.handle}>GO TO USER {user.handle}</UserLink>
      <div>user.handle: {user.handle}</div>
      {tweets.map((tweet, i) => {
        return (
          <Tweet
            key={tweet.id}
            id={tweet.id}
            handle={tweet.author.handle}
            image={tweet.author.image}
            createdAt={tweet.createdAt}
            text={tweet.text}
            replies={tweet._count.replies}
            retweets={tweet._count.retweets}
            likes={tweet._count.likes}
            drawReplyLine={i !== tweets.length - 1}
          />
        );
      })}
    </div>
  );
};

export default Page;

//////////////////////////
// props

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const handle = stringFromParam(params?.handle);
    const hashId = stringFromParam(params?.hashId);
    if (!handle || !hashId) return { notFound: true };
    const [user, tweet] = await Promise.all([getUserByHandle(handle), getTweetByHashId(hashId)]);

    if (!user || !tweet) return { notFound: true };

    if (tweet.authorId !== user.id) return { notFound: true };

    const tweets: Tweet[] = [tweet];
    let tweetId: number | null | undefined = tweet.repliedToTweetId;
    while (tweetId) {
      const tweet: Tweet | null = await getTweetById(tweetId);
      tweetId = tweet?.repliedToTweetId;
      if (tweet) {
        tweets.push(tweet);
      }
    }

    const props: Props = { user, tweets: tweets.reverse() };
    return {
      props,
      revalidate: false, //handle this manually
    };
  } catch (error) {
    throw new Error("something went wrong");
  }
};
