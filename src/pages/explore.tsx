import { type NextPage } from "next";
import { useMemo } from "react";
import { Tweet } from "src/components/Tweet";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { trpc } from "src/utils/trpc";

const Page: NextPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.explore.tweets.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweets = useMemo(() => data?.pages.map((page) => page.items).flat(), [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  return (
    <div className="">
      {tweets?.map((tweet) => {
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
