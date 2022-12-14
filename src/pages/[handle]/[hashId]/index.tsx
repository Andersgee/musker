import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { SEO } from "src/components/SEO";
import { Tweet } from "src/components/Tweet";
import { TweetCreate } from "src/components/TweetCreate";
import { useTweetRepliesList } from "src/hooks/useInfiniteList";
import { getTweetByHashId, getTweetById, getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";
import { trpc } from "src/utils/trpc";

type Tweet = NonNullable<inferAsyncReturnType<typeof getTweetByHashId>>;

type Props = {
  pageTweet: Tweet;
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
  tweets: Tweet[];
  tweetId: number;
  hashId: string;
};

const Page: NextPage<Props> = ({ pageTweet, user, tweets, tweetId, hashId }) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const { replies, ref, isFetchingNextPage } = useTweetRepliesList(!router.isFallback, tweetId);

  const { mutateAsync: create, isLoading } = trpc.tweet.reply.useMutation({
    onSuccess: () => {
      utils.tweet.replies.invalidate({ tweetId });
    },
  });

  const onCreateClick = async (text: string) => {
    await create({ text, tweetId });
  };

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <>
      <SEO
        title={`Tweet / musker`}
        description={`${user.handle} - ${pageTweet.text}`}
        url={`/${user.handle}/${hashId}`}
        image={`/api/og/tweet?hashId=${hashId}`}
      />
      <div>
        {tweets.map((tweet) => {
          return (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              handle={tweet.author.handle}
              image={tweet.author.image}
              createdAt={tweet.createdAt}
              text={tweet.text}
              replies={tweet.repliesCount}
              retweets={tweet.retweetsCount}
              likes={tweet.likesCount}
              drawReplyLine={tweet.id !== pageTweet.id}
            />
          );
        })}
        <TweetCreate onClick={onCreateClick} disabled={isLoading} placeholder="Tweet your reply" />
        {replies?.map((tweet) => {
          return (
            <div key={tweet.id}>
              <Tweet
                id={tweet.id}
                handle={tweet.author.handle}
                image={tweet.author.image}
                createdAt={tweet.createdAt}
                text={tweet.text}
                replies={tweet.repliesCount}
                retweets={tweet.retweetsCount}
                likes={tweet.likesCount}
              />
              <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
            </div>
          );
        })}
        <div ref={ref} className="mt-4 flex justify-center">
          {isFetchingNextPage ? "loading..." : "."}
        </div>
      </div>
    </>
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
      const parent: Tweet | null = await getTweetById(tweetId);
      tweetId = parent?.repliedToTweetId;
      if (parent) {
        tweets.push(parent);
      }
    }

    const props: Props = { pageTweet: tweet, user, tweetId: tweet.id, tweets: tweets.reverse(), hashId };
    return {
      props,
      revalidate: 60,
    };
  } catch (error) {
    throw new Error("something went wrong");
  }
};
