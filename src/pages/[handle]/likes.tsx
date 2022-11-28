import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Tweet } from "src/components/Tweet";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";
import { trpc } from "src/utils/trpc";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.likes.useInfiniteQuery(
    { userId: user?.id },
    {
      enabled: !router.isFallback,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweetLikes = useMemo(() => data?.pages.map((page) => page.items).flat(), [data]);

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
      {tweetLikes?.map((tweetLike) => {
        const tweet = tweetLike.tweet;
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
            />
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
