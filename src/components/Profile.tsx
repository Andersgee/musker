import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconDate } from "src/icons/Date";
import { FollowButton } from "./FollowButton";

import { UserLink } from "./Link";

type Props = {
  userId: string;
  handle: string | null;
  image: string | null;
  bio?: string | null;
  sentFollows: number;
  recievedFollows: number;
  createdAt: Date;
  className?: string;
};

export function Profile({
  userId,
  handle,
  image,
  bio,
  sentFollows,
  recievedFollows,
  createdAt,
  className = "",
}: Props) {
  if (!handle) {
    return null;
  }
  return (
    <div className={`mx-2 ${className}`}>
      <div className="flex items-baseline justify-between">
        <UserLink className="h-28 w-28" userHandle={handle}>
          <img
            className="h-28 w-28 rounded-full shadow-imageborder"
            src={image || undefined}
            alt={handle || undefined}
          />
        </UserLink>
        <FollowButton userId={userId} />
      </div>
      <h2>{handle}</h2>
      <p>{bio}</p>
      <div className="flex gap-3">
        <Link href={`/${handle}/following`}>{sentFollows} following</Link>
        <Link href={`/${handle}/followers`}>{recievedFollows} followers</Link>
      </div>
      <span className="flex items-center text-sm">
        <IconDate className="h-5 w-5" />
        Joined {format(createdAt, "MMMM yyyy")}
      </span>
      <Nav handle={handle} />
    </div>
  );
}

type NavProps = {
  handle: string;
  className?: string;
};

function Nav({ handle, className = "" }: NavProps) {
  const { pathname } = useRouter();
  return (
    <div className={` ${className}`}>
      <div className="mt-4 mb-6 flex justify-evenly">
        <NavLink href={`/${handle}`} active={pathname.endsWith("[handle]")}>
          Tweets
        </NavLink>
        <NavLink href={`/${handle}/with_replies`} active={pathname.endsWith("with_replies")}>
          Tweets & replies
        </NavLink>
        <NavLink href={`/${handle}/likes`} active={pathname.endsWith("likes")}>
          Likes
        </NavLink>
      </div>
    </div>
  );
}

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
};

function NavLink({ href, active = false, children }: NavLinkProps) {
  return (
    <Link
      className={`flex-1 px-3 py-2 text-center hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
        active ? "border-b-2 border-blue-500 text-black dark:text-white" : "text-neutral-700 dark:text-neutral-300"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
