import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Profile } from "src/components/Profile";
import { SEO } from "src/components/SEO";
import { LikedBy, Tweet } from "src/components/Tweet";
import { useProfileLikesList } from "src/hooks/useInfiniteList";
import { getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();
  const { tweetLikes, ref, isFetchingNextPage } = useProfileLikesList(!router.isFallback, user?.id);

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <>
      <SEO
        title={`${user.handle} / musker`}
        description="A twitter clone"
        url={`/${user.handle}/likes`}
        image="/og/musker.png"
      />
      <div>
        <Profile
          userId={user.id}
          handle={user.handle}
          image={user.image}
          bio={user.bio?.text}
          createdAt={user.createdAt}
          sentFollows={0}
          recievedFollows={0}
        />
        {tweetLikes.map((tweetLike) => {
          const tweet = tweetLike.tweet;
          return (
            <div key={tweet.id} className="my-0">
              <Tweet
                id={tweet.id}
                handle={tweet.author.handle}
                image={tweet.author.image}
                createdAt={tweet.createdAt}
                text={tweet.text}
                replies={tweet.repliesCount}
                retweets={tweet.retweetsCount}
                likes={tweet.likesCount}
                repliedToHandle={tweet.repliedToTweet?.author.handle}
              >
                <LikedBy handle={user.handle} />
              </Tweet>
              <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
            </div>
          );
        })}
        <div ref={ref} className="mt-4 flex justify-center">
          {isFetchingNextPage ? "loading..." : "."}
        </div>
      </div>
    </>
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
      revalidate: 60,
    };
  } catch (error) {
    throw new Error("something went wrong");
  }
};
