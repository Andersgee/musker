import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDialogDispatch } from "src/context/DialogContext";
import { IconHeart } from "src/icons/Heart";
import { IconReply } from "src/icons/Reply";
import { IconRewteet } from "src/icons/Retweet";
import { trpc } from "src/utils/trpc";
import { TweetLink } from "./Link";

type Props = {
  userHandle: string | null;
  tweetId: number;
  className?: string;
};

export function TweetActions({ userHandle, tweetId, className = "" }: Props) {
  const replyCount = 0;
  const [likeCount, setLikeCount] = useState(0);
  const [retweetCount, setRetweetCount] = useState(0);

  const dialogDispatch = useDialogDispatch();
  const { data: session } = useSession();
  const userExists = !!session?.user;

  const { data: hasLiked } = trpc.tweet.hasLiked.useQuery({ tweetId }, { enabled: userExists });
  const { mutateAsync: like } = trpc.tweet.like.useMutation();
  const { mutateAsync: unlike } = trpc.tweet.unlike.useMutation();

  const { data: hasRetweeted } = trpc.tweet.hasRetweeted.useQuery({ tweetId }, { enabled: userExists });
  const { mutateAsync: retweet } = trpc.tweet.retweet.useMutation();
  const { mutateAsync: unretweet } = trpc.tweet.unretweet.useMutation();

  const utils = trpc.useContext();

  const handleLikeClick = async () => {
    if (!userExists) {
      dialogDispatch({ type: "show", name: "signin" });
      return;
    }

    if (hasLiked) {
      await unlike({ tweetId });
      setLikeCount((prev) => prev - 1);
    } else {
      await like({ tweetId });
      setLikeCount((prev) => prev + 1);
    }
    utils.tweet.hasLiked.invalidate({ tweetId });
  };

  const handleRetweetClick = async () => {
    if (!userExists) {
      dialogDispatch({ type: "show", name: "signin" });
      return;
    }

    if (hasLiked) {
      await unretweet({ tweetId });
      setRetweetCount((prev) => prev - 1);
    } else {
      await retweet({ tweetId });
      setRetweetCount((prev) => prev + 1);
    }
    utils.tweet.hasLiked.invalidate({ tweetId });
  };

  return (
    <div className={`flex w-full gap-4 ${className}`}>
      <TweetLink userHandle={userHandle} tweetId={tweetId} className="group flex w-20 pt-1">
        <IconReply className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {replyCount}
      </TweetLink>
      <button className="group flex w-20" title="Retweet" onClick={handleRetweetClick}>
        <IconRewteet className={`mr-2 h-6 w-6 ${hasRetweeted ? "text-green-600" : "group-hover:text-green-300"}`} />
        {retweetCount}
      </button>
      <button className="group flex w-20" title="Like" onClick={handleLikeClick}>
        <IconHeart className={`mr-2 h-6 w-6 ${hasLiked ? "text-pink-600" : "group-hover:text-pink-300"}`} />
        {likeCount}
      </button>
    </div>
  );
}
