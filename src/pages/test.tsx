import { type NextPage } from "next";
import Link from "next/link";
import { SEO } from "src/components/SEO";
import { hashidFromNumber } from "src/utils/hashids";
import { trpc } from "src/utils/trpc";

const Page: NextPage = () => {
  const { mutateAsync, isLoading } = trpc.handle.debugcreate.useMutation();

  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/" image="/og/musker.png" />
      <div>
        <div>hello world</div>
        <button disabled={isLoading} onClick={() => mutateAsync({ path: "/deserunt" })}>
          CLICK HERE TO REVALiDATE /deserunt
        </button>
        <div>29: {hashidFromNumber(29)}</div>
        <div className="bg-green-500">h ello</div>
        <Link className="block" href="/ad">
          ad
        </Link>
        <Link className="block" href="/ad/JP9d7">
          ad/JP9d7
        </Link>

        <div className="flex flex-col gap-2">
          <Link href="/example">go to example</Link>
          <h1>testing caching and page load time... for user pages</h1>
          <h2 className="mt-4">existing pregenerated</h2>
          <Link href="/eu">go to eu</Link>
          <Link href="/aliqua">go to aliqua</Link>
          <Link href="/tempor">go to tempor</Link>
          <Link href="/ullamco">go to ullamco</Link>
          <Link href="/mollit">go to mollit</Link>
          <Link href="/laboris">go to laboris</Link>

          <h2 className="mt-4">existing but not pregenerated</h2>
          <Link href="/deserunt">go to deserunt</Link>
          <Link href="/magna">go to magna</Link>
          <Link href="/commodo">go to commodo</Link>
          <Link href="/ad">go to ad</Link>

          <h2 className="mt-4">nonexisting</h2>
          <Link href="/kekker">go to kekker</Link>
          <Link href="/berkor">go to berkor</Link>
          <Link href="/mamma">go to mamma</Link>

          <h2 className="mt-4">nonexisting generated anyway?..</h2>
          <Link href="/kekker">go to kekker</Link>
          <Link href="/berkor">go to berkor</Link>
          <Link href="/mamma">go to mamma</Link>
        </div>
      </div>
    </>
  );
};

export default Page;
