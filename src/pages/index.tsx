import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { SEO } from "src/components/SEO";
import { TweetCreate } from "src/components/TweetCreate";
import { IconMusker } from "src/icons/Musker";
import { trpc } from "src/utils/trpc";
import { ExploreList } from "src/components/ExploreList";
import { Button } from "src/ui/Button";
import { useDialogDispatch } from "src/context/DialogContext";

const Page: NextPage = () => {
  const { data: session, status } = useSession();
  const userExists = !!session?.user;
  const utils = trpc.useContext();

  const { mutateAsync: create, isLoading } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      //utils.home.tweets.invalidate();
    },
  });

  const onCreateClick = async (text: string) => {
    await create({ text });
  };

  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/" image="/og/musker.png" />
      <div>
        <TweetCreate onClick={onCreateClick} disabled={isLoading} placeholder="What's happening?" />
        {status === "unauthenticated" && <HomeUnAuthenticated />}
        {status === "authenticated" && <HomeList />}
      </div>
    </>
  );
};

export default Page;

function HomeList() {
  const tweets = [];
  if (tweets.length === 0) {
    return (
      <div className="text-center">
        <IconMusker className="h-auto w-full" />
        <h3>Go follow some people to make this feed peronal.</h3>
        <p>(Until then you will just see the general explore feed here)</p>
        <ExploreList />
      </div>
    );
  }
  return <div>HomeList</div>;
}

function HomeUnAuthenticated() {
  const dialogDispatch = useDialogDispatch();
  return (
    <div>
      <div className="mb-12 flex flex-col items-center gap-2 text-center">
        <IconMusker className="h-auto w-full" />
        <h3>You are not signed in</h3>
        <p>showing you explore feed instead of your personal feed</p>
        <Button className="block w-32" onClick={() => dialogDispatch({ type: "show", name: "signin" })}>
          sign in
        </Button>
      </div>
      <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <ExploreList />
    </div>
  );
}
