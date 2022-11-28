import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { UserLink } from "src/components/Link";
import { Tweet } from "src/components/Tweet";
import { TweetCreate } from "src/components/TweetCreate";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { getTweetByHashId, getTweetById, getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";
import { trpc } from "src/utils/trpc";

type Tweet = NonNullable<inferAsyncReturnType<typeof getTweetByHashId>>;

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
  tweets: Tweet[];
  tweetId: number;
};

const Page: NextPage<Props> = ({ user, tweets, tweetId }) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.tweet.replies.useInfiniteQuery(
    { tweetId: tweetId },
    {
      enabled: !router.isFallback,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const replies = useMemo(() => data?.pages.map((page) => page.items).flat(), [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

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
      <TweetCreate onClick={onCreateClick} disabled={isLoading} placeholder="Tweet your reply" />
      {replies?.map((tweet) => {
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
          />
        );
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

    const props: Props = { user, tweetId: tweet.id, tweets: tweets.reverse() };
    return {
      props,
      revalidate: false, //handle this manually
    };
  } catch (error) {
    throw new Error("something went wrong");
  }
};
