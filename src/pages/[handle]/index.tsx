import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Profile } from "src/components/Profile";
import { SEO } from "src/components/SEO";
import { RetweetedBy, Tweet } from "src/components/Tweet";
import { useProfileTweetsList } from "src/hooks/useInfiniteList";
import { getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();
  const { tweetsAndRetweets, ref, isFetchingNextPage } = useProfileTweetsList(!router.isFallback, user?.id);

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <>
      <SEO
        title={`${user.handle} / musker`}
        description="A twitter clone"
        url={`/${user.handle}`}
        image="/og/musker.png"
      />
      <div>
        <Profile
          userId={user.id}
          handle={user.handle}
          image={user.image}
          bio={user.bio?.text}
          createdAt={user.createdAt}
          sentFollows={user._count.sentFollows}
          recievedFollows={user._count.recievedFollows}
        />
        {tweetsAndRetweets.map((tweetOrRetweet) => {
          if ("author" in tweetOrRetweet) {
            //this is a tweet
            const tweet = tweetOrRetweet;
            return (
              <div key={tweet.id} className="my-0">
                <Tweet
                  id={tweet.id}
                  handle={tweet.author.handle}
                  image={tweet.author.image}
                  createdAt={tweet.createdAt}
                  text={tweet.text}
                  replies={tweet._count.replies}
                  retweets={tweet._count.retweets}
                  likes={tweet._count.likes}
                  repliedToHandle={tweet.repliedToTweet?.author.handle}
                />
                <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
              </div>
            );
          } else if ("tweet" in tweetOrRetweet) {
            //this is a retweet
            const retweet = tweetOrRetweet;
            const tweet = retweet.tweet;
            return (
              <div key={tweet.id} className="my-0">
                <Tweet
                  className=""
                  id={tweet.id}
                  handle={tweet.author.handle}
                  image={tweet.author.image}
                  createdAt={tweet.createdAt}
                  text={tweet.text}
                  replies={tweet._count.replies}
                  retweets={tweet._count.retweets}
                  likes={tweet._count.likes}
                  repliedToHandle={tweet.repliedToTweet?.author.handle}
                >
                  <RetweetedBy handle={retweet.user.handle} />
                </Tweet>
                <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
              </div>
            );
          }
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
    if (!handle) return { notFound: true };
    const user = await getUserByHandle(handle);

    if (!user) return { notFound: true };

    const props: Props = { user };
    return {
      props,
      revalidate: 60,
    };
  } catch (error) {
    throw new Error("something went wrong");
  }
};
