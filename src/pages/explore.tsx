import { type NextPage } from "next";
import { useMemo } from "react";
import { TweetLink, UserLink } from "src/components/Link";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { formatCreatedAt } from "src/utils/date";
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
            <article className="flex">
              <UserLink userHandle={tweet.author.handle} className="h-12 w-12">
                <img
                  className="ml-2 mt-2 h-8 w-8 rounded-full shadow-imageborder"
                  src={tweet.author.image || ""}
                  alt={tweet.author.handle || ""}
                />
              </UserLink>
              <div className="flex-1">
                <TweetLink userHandle={tweet.author.handle} tweetId={tweet.id} className="">
                  <div className="pt-4 pb-2  hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <h3 className="text-base font-normal">
                      {tweet.author.handle} - {formatCreatedAt(tweet.createdAt)}
                    </h3>
                    <p>{tweet.text}</p>
                  </div>
                </TweetLink>
                <div className="pb-4">actions here</div>
              </div>
            </article>
            <hr className="m-0 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
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
