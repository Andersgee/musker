import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { UserLink } from "src/components/Link";
import { Profile } from "src/components/Profile";
import { RetweetedBy, Tweet } from "src/components/Tweet";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { IconDate } from "src/icons/Date";
import { getUserByHandle } from "src/server/common/pagedata";
import { formatCreatedAt } from "src/utils/date";
import { stringFromParam } from "src/utils/param";
import { trpc, type RouterOutputs } from "src/utils/trpc";

//type OutputTweet = RouterOutputs["profile"]["tweetsAndRetweets"]["items"]["tweets"][number];
//type OutputRetweet = RouterOutputs["profile"]["tweetsAndRetweets"]["items"]["retweets"][number];

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.tweetsWithReplies.useInfiniteQuery(
    { userId: user?.id },
    {
      enabled: !router.isFallback,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweetsAndRetweets = useMemo(() => {
    //flatten and sort by createdAt, (using the retweets own createdAt)
    const tweets = data?.pages.map((page) => page.items.tweets).flat() || [];
    const retweets = data?.pages.map((page) => page.items.retweets).flat() || [];
    const all = [...tweets, ...retweets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return all;
  }, [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <Profile
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
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
        </button>
      </div>
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
    if (!handle) return { notFound: true };
    const user = await getUserByHandle(handle);

    if (!user) return { notFound: true };

    const props: Props = { user };
    return {
      props,
      revalidate: false, //handle this manually
    };
  } catch (error) {
    throw new Error("something went wrong");
  }
};
