import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { UserLink } from "src/components/Link";
import { Tweet } from "src/components/Tweet";
import { UseIntersectionObserverCallback } from "src/hooks/useIntersectionObserverCallback";
import { IconDate } from "src/icons/Date";
import { getUserByHandle } from "src/server/common/pagedata";
import { formatCreatedAt } from "src/utils/date";
import { stringFromParam } from "src/utils/param";
import { trpc } from "src/utils/trpc";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.tweets.useInfiniteQuery(
    { userId: user.id },
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

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <div className="mx-2">
        <div className="flex items-baseline justify-between">
          <UserLink className="h-28 w-28" userHandle={user.handle}>
            <img src={user.image || ""} alt={user.handle || ""} />
          </UserLink>
          <div>
            <button>follow</button>
          </div>
        </div>
        <h2>{user.handle}</h2>
        <p>{user.bio?.text}</p>
        <div className="flex gap-3">
          <Link href={`/${user.handle}/following`}>{user._count.sentFollows} following</Link>
          <Link href={`/${user.handle}/followers`}>{user._count.recievedFollows} followers</Link>
        </div>
        <span className="flex items-center text-sm">
          <IconDate className="h-5 w-5" />
          Joined {formatCreatedAt(user.createdAt)}
        </span>
      </div>
      <div>profile nav here</div>
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
  //return { paths: [], fallback: true };

  return {
    paths: [
      { params: { handle: "eu" } },
      { params: { handle: "aliqua" } },
      //{params: { handle: "deserunt" }}, //exist but dont generate
      //{params: { handle: "magna" }}, //exist but dont generate
      //{params: { handle: "commodo" }}, //exist but dont generate
      //{params: { handle: "ad" }}, //exist but dont generate
      { params: { handle: "tempor" } },
      { params: { handle: "ullamco" } },
      { params: { handle: "mollit" } },
      { params: { handle: "laboris" } },
      { params: { handle: "kekker" } }, //nonexisting but generate anyway?
      { params: { handle: "berkor" } }, //nonexisting but generate anyway?
      { params: { handle: "mamma" } }, //nonexisting but generate anyway?
    ],
    fallback: true,
  };
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
