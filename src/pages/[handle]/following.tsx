import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NavFollows } from "src/components/NavFollows";
import { useFollowingList } from "src/hooks/useInfiniteList";
import { getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();
  const { follows, ref, isFetchingNextPage, hasNextPage } = useFollowingList(!router.isFallback, user?.id);

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <NavFollows handle={user.handle || ""} />
      {follows.map((follow) => (
        <div key={follow.followerId}>{follow.user.handle}</div>
      ))}
      <div ref={ref} className="mt-4 flex justify-center">
        {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
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
