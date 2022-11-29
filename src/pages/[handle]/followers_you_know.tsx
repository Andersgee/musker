import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NavFollows } from "src/components/NavFollows";
import { UserRow } from "src/components/UserRow";
import { useKnownFollowersList } from "src/hooks/useInfiniteList";
import { getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();
  const { follows, ref, isFetchingNextPage } = useKnownFollowersList(!router.isFallback, user?.id);

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <NavFollows handle={user.handle || ""} />
      {follows.map((follow) => (
        <UserRow
          key={follow.followerId}
          userId={follow.followerId}
          handle={follow.follower.handle}
          image={follow.follower.image}
        />
      ))}
      <div ref={ref} className="mt-4 flex justify-center">
        {isFetchingNextPage ? "loading..." : "."}
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
