import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NavFollows } from "src/components/NavFollows";
import { SEO } from "src/components/SEO";
import { UserRow } from "src/components/UserRow";
import { useFollowersList } from "src/hooks/useInfiniteList";
import { getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();
  const { follows, ref, isFetchingNextPage, hasNextPage } = useFollowersList(!router.isFallback, user?.id);

  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <>
      <SEO
        title={`${user.handle} / musker`}
        description="A twitter clone"
        url={`/${user.handle}/followers`}
        image="/og/musker.png"
      />

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
          {isFetchingNextPage ? "loading..." : hasNextPage ? "Load More" : ""}
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
