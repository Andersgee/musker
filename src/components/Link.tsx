import Link from "next/link";
import { tweetpath, userpath } from "src/utils/url";

type UserLinkProps = {
  userHandle: string | null;
  className?: string;
  children: React.ReactNode;
};

export function UserLink({ userHandle, children, className = "" }: UserLinkProps) {
  return (
    <Link href={userpath(userHandle)} className={className}>
      {children}
    </Link>
  );
}

type TweetLinkProps = {
  userHandle: string | null;
  tweetId: number;
  className?: string;
  children: React.ReactNode;
};

export function TweetLink({ userHandle, tweetId, children, className = "" }: TweetLinkProps) {
  return (
    <Link href={tweetpath(userHandle, tweetId)} className={className}>
      {children}
    </Link>
  );
}
