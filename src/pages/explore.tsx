import { type NextPage } from "next";
import { useMemo } from "react";
import { TweetLink } from "src/components/Link";
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
          <div key={tweet.id} className="py-4">
            <TweetLink userHandle={tweet.author.handle} tweetId={tweet.id}>
              GO TO TWEET
            </TweetLink>
            <p>{tweet.text}</p>
            <hr />
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
