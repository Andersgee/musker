import { type NextPage } from "next";
import { Tweet } from "src/components/Tweet";
import { useExploreList } from "src/hooks/useInfiniteList";

const Page: NextPage = () => {
  const { tweets, ref, isFetchingNextPage } = useExploreList();

  return (
    <div className="">
      {tweets.map((tweet) => {
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
        {isFetchingNextPage ? "loading..." : "."}
      </div>
    </div>
  );
};

export default Page;
