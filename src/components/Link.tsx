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

type UserImageLinkProps = {
  handle: string | null;
  image: string | null;
};
export function UserImageLink({ handle, image }: UserImageLinkProps) {
  return (
    <UserLink userHandle={handle} className="group mt-2 h-12 w-12 flex-shrink-0">
      <img
        className="h-12 w-12 rounded-full shadow-imageborder group-hover:opacity-80 group-hover:transition-opacity"
        src={image || undefined}
        alt={handle || undefined}
      />
    </UserLink>
  );
}
