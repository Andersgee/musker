import { formatCreatedAt } from "src/utils/date";
import { TweetLink, UserLink } from "./Link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDialogDispatch } from "src/context/DialogContext";
import { IconHeart } from "src/icons/Heart";
import { IconReply } from "src/icons/Reply";
import { IconRewteet } from "src/icons/Retweet";
import { trpc } from "src/utils/trpc";

type Props = {
  id: number;
  image: string | null;
  handle: string | null;
  createdAt: Date;
  text: string;
  className?: string;
  replies: number;
  retweets: number;
  likes: number;
  drawReplyLine?: boolean;
};

export function Tweet({
  id,
  handle,
  image,
  createdAt,
  text,
  replies,
  retweets,
  likes,
  drawReplyLine = false,
  className = "",
}: Props) {
  return (
    <article className={`flex ${className}`}>
      <div className="mt-2 flex flex-col">
        <UserLink userHandle={handle} className="mt-2 h-12 w-12">
          <img
            className="h-12 w-12 rounded-full shadow-imageborder"
            src={image || undefined}
            alt={handle || undefined}
          />
        </UserLink>
        <div className="mt-2 flex-1">{drawReplyLine && <div className="ml-6 h-full border-l-2 "></div>}</div>
      </div>
      <div className="flex-1">
        <TweetLink userHandle={handle} tweetId={id}>
          <div className="px-2 pt-4 pb-2  hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 className="text-base font-normal">
              {handle} - {formatCreatedAt(createdAt)}
            </h3>
            <pre className="text-tweet">{text}</pre>
          </div>
        </TweetLink>
        <Actions userHandle={handle} tweetId={id} replies={replies} retweets={retweets} likes={likes} />
      </div>
    </article>
  );
}

type ActionsProps = {
  userHandle: string | null;
  tweetId: number;
  className?: string;
  replies: number;
  retweets: number;
  likes: number;
};

export function Actions({ userHandle, tweetId, replies, retweets, likes, className = "" }: ActionsProps) {
  const replyCount = replies;
  const [retweetCount, setRetweetCount] = useState(retweets);
  const [likeCount, setLikeCount] = useState(likes);

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
    <div className={`ml-2 flex w-full gap-4 ${className}`}>
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
