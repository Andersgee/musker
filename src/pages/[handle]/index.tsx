import type { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
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
      <div>user: {JSON.stringify(user)}</div>
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
