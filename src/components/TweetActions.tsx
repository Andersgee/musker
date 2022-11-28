import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const { data: hasLiked } = trpc.tweet.hasLiked.useQuery({ tweetId }, { enabled: !!session?.user });
  const { data: hasRetweeted } = trpc.tweet.hasRetweeted.useQuery({ tweetId }, { enabled: !!session?.user });

  const handleRetweetClick = () => {
    console.log("handleRetweetClick");
  };
  const handleLikeClick = () => {
    console.log("handleLikeClick");
  };

  return (
    <div className={`flex w-full gap-4 ${className}`}>
      <TweetLink userHandle={userHandle} tweetId={tweetId} className="group flex w-20 pt-1">
        <IconReply className="mr-2 h-6 w-6 group-hover:text-blue-500" /> {0}
      </TweetLink>
      <button className="group flex w-20" title="Retweet" onClick={handleRetweetClick}>
        <IconRewteet className={`mr-2 h-6 w-6 ${hasRetweeted ? "text-green-600" : "group-hover:text-green-300"}`} />
        {0}
      </button>
      <button className="group flex w-20" title="Like" onClick={handleLikeClick}>
        <IconHeart className={`mr-2 h-6 w-6 ${hasLiked ? "text-pink-600" : "group-hover:text-pink-300"}`} />
        {0}
      </button>
    </div>
  );
}
