import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { UserLink } from "src/components/Link";
import { getTweetByHashId, getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
  tweet: NonNullable<inferAsyncReturnType<typeof getTweetByHashId>>;
};

const Page: NextPage<Props> = ({ user, tweet }) => {
  const router = useRouter();
  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <UserLink userHandle={user.handle}>GO TO USER {user.handle}</UserLink>
      <div>user: {JSON.stringify(user)}</div>
      <div>...</div>
      <div>tweet: {JSON.stringify(tweet)}</div>
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
    const hashId = stringFromParam(params?.hashId);
    if (!handle || !hashId) return { notFound: true };
    const [user, tweet] = await Promise.all([getUserByHandle(handle), getTweetByHashId(hashId)]);

    if (!user || !tweet) return { notFound: true };

    if (tweet.authorId !== user.id) return { notFound: true };

    const props: Props = { user, tweet };
    return {
      props,
      revalidate: false, //handle this manually
    };
  } catch (error) {
    throw new Error("something went wrong");
  }
};
