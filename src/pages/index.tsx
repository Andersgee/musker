import { type NextPage } from "next";
import Link from "next/link";
import { hashidFromNumber } from "src/utils/hashids";
//import Head from "next/head";

//import { trpc } from "../utils/trpc";

const Page: NextPage = () => {
  //const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div>
      <div>29: {hashidFromNumber(29)}</div>
      <div className="bg-green-500">h ello</div>
      <Link className="block" href="/ad">
        ad
      </Link>
      <Link className="block" href="/ad/JP9d7">
        ad/JP9d7
      </Link>
    </div>
  );
};

export default Page;
