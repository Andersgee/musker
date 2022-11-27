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
          <div key={tweet.id} className="py-4">
            <article className="flex">
              <UserLink userHandle={tweet.author.handle} className="w-12">
                <img
                  className="h-8 w-8 rounded-full shadow-imageborder"
                  src={tweet.author.image || ""}
                  alt={tweet.author.handle || ""}
                />
              </UserLink>
              <div className="flex-1 py-2 pl-2 ">
                <TweetLink userHandle={tweet.author.handle} tweetId={tweet.id}>
                  <div className=" hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <h3 className="text-base font-normal">
                      {tweet.author.handle} - {formatCreatedAt(tweet.createdAt)}
                    </h3>
                    <p>{tweet.text}</p>
                  </div>
                </TweetLink>
                <div>actions here</div>
              </div>
            </article>
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
