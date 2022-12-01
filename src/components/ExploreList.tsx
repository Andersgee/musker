import { useExploreList } from "src/hooks/useInfiniteList";
import { Tweet } from "./Tweet";

type Props = {
  className?: string;
};

export function ExploreList({ className = "" }: Props) {
  const { tweets, ref, isFetchingNextPage } = useExploreList();

  return (
    <div className={className}>
      {tweets.map((tweet) => {
        return (
          <div key={tweet.id} className="my-0">
            <Tweet
              id={tweet.id}
              handle={tweet.author.handle}
              image={tweet.author.image}
              createdAt={tweet.createdAt}
              text={tweet.text}
              replies={0}
              retweets={0}
              likes={0}
              repliedToHandle={tweet.repliedToTweet?.author.handle}
            />
            <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
          </div>
        );
      })}
      <div ref={ref} className="mt-4 flex justify-center">
        {isFetchingNextPage ? "loading..." : "."}
      </div>
    </div>
  );
}
