import { type NextPage } from "next";
//import Head from "next/head";

import { trpc } from "../utils/trpc";

const Page: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return <div className="bg-green-500">hello</div>;
};

export default Page;
