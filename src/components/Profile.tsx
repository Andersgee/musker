import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDialogDispatch } from "src/context/DialogContext";

import { IconDate } from "src/icons/Date";
import { Button } from "src/ui/Button";
import { hashidFromNumber } from "src/utils/hashids";
import { trpc } from "src/utils/trpc";
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
  const { data: followCount } = trpc.profile.followCount.useQuery({ userId });
  const { data: session } = useSession();
  const dialogDispatch = useDialogDispatch();
  const router = useRouter();

  const { mutateAsync: createConversation, isLoading: createConverstaionIsLoading } =
    trpc.message.createConversation.useMutation();

  const onMessageClick = async () => {
    try {
      const conversation = await createConversation({ userId });
      router.push(`/messages/${hashidFromNumber(conversation.id)}`);
    } catch (error) {}
  };

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
        {userId === session?.user?.id ? (
          <button
            className="w-30 rounded-full border border-neutral-500 bg-white px-3 py-2 font-semibold dark:bg-black"
            onClick={() => dialogDispatch({ type: "show", name: "editprofile" })}
          >
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="w-30 rounded-full border border-neutral-500 bg-white px-3 py-2 font-semibold dark:bg-black"
              onClick={onMessageClick}
              disabled={createConverstaionIsLoading}
            >
              Message
            </button>
            <FollowButton userId={userId} />
          </div>
        )}
      </div>
      <h2>{handle}</h2>

      <p>{bio}</p>

      <div className="flex gap-3">
        <Link href={`/${handle}/following`}>{followCount?.sentFollowsCount ?? sentFollows} following</Link>
        <Link href={`/${handle}/followers`}>{followCount?.recievedFollowsCount ?? recievedFollows} followers</Link>
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
