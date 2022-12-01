import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { SEO } from "src/components/SEO";
import { TweetCreate } from "src/components/TweetCreate";
import { IconMusker } from "src/icons/Musker";
import { trpc } from "src/utils/trpc";
import { ExploreList } from "src/components/ExploreList";
import { Button } from "src/ui/Button";
import { useDialogDispatch } from "src/context/DialogContext";
import { useHomeList } from "src/hooks/useInfiniteList";
import { Tweet } from "src/components/Tweet";
import { ButtonLink } from "src/ui/ButtonLink";

const Page: NextPage = () => {
  const { status } = useSession();

  const utils = trpc.useContext();

  const { mutateAsync: create, isLoading } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      utils.home.tweets.invalidate();
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
  const { data: session, status: sessionStatus } = useSession();
  const userExists = !!session?.user;
  const { tweets, isLoading } = useHomeList(userExists);
  if (!(sessionStatus === "loading") && !isLoading && tweets.length < 1) {
    return (
      <div>
        <div>
          <IconMusker className="h-auto w-full" />
          <div className="text-center">
            <h3>Go follow some people to make this feed peronal.</h3>
            <p>(Until then showing general explore feed here)</p>
          </div>
          <div className="flex justify-center">
            <ButtonLink href="/explore" className="mt-2">
              explore
            </ButtonLink>
          </div>
        </div>
        <hr className="my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
        <ExploreList />
      </div>
    );
  }
  return (
    <div className="">
      {tweets.map((tweet) => {
        return (
          <div key={tweet.id} className="my-0">
            <Tweet
              id={tweet.id}
              handle={tweet.author.handle}
              image={tweet.author.image}
              createdAt={tweet.createdAt}
              text={tweet.text}
              replies={tweet.repliesCount}
              retweets={tweet.retweetsCount}
              likes={tweet.likesCount}
              repliedToHandle={tweet.repliedToTweet?.author.handle}
            />
            <hr className="my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
          </div>
        );
      })}
    </div>
  );
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
