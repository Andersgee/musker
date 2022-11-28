import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { SEO } from "src/components/SEO";
import { TweetCreate } from "src/components/TweetCreate";
import { IconMusker } from "src/icons/Musker";
import { trpc } from "src/utils/trpc";

const Page: NextPage = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  const { mutateAsync: create, isLoading } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      //utils.home.tweets.invalidate();
    },
  });

  const onClick = async (text: string) => {
    await create({ text });
  };

  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/" image="/og/musker.png" />
      <div>
        <TweetCreate onClick={onClick} disabled={isLoading} placeholder="What's happening?" />
        <IconMusker />
        <div>show home tweets here</div>
      </div>
    </>
  );
};

export default Page;
