import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { NavFollows } from "src/components/NavFollows";
import { getUserByHandle } from "src/server/common/pagedata";
import { stringFromParam } from "src/utils/param";

type Props = {
  user: NonNullable<inferAsyncReturnType<typeof getUserByHandle>>;
};

const Page: NextPage<Props> = ({ user }) => {
  const router = useRouter();
  if (router.isFallback) {
    //possibly skeleton here
    return <div></div>;
  }

  return (
    <div>
      <NavFollows handle={user.handle || ""} />
      <div>followers for user.id: {user.id} here</div>
      <div>a couple could be statically generated...</div>
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