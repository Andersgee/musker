import { useSession } from "next-auth/react";
import { useDialogDispatch } from "src/context/DialogContext";

import { trpc } from "src/utils/trpc";

type Props = {
  userId: string;
};

export function FollowButton({ userId }: Props) {
  const dialogDispatch = useDialogDispatch();
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const utils = trpc.useContext();

  const { data: isFollowing } = trpc.user.isFollowing.useQuery(
    { userId },
    {
      enabled: userExists,
    },
  );
  const { mutateAsync: follow } = trpc.user.follow.useMutation({
    onSuccess: () => {
      utils.user.isFollowing.invalidate({ userId });
      utils.profile.followCount.invalidate({ userId });
      if (session?.user?.id) {
        utils.profile.followCount.invalidate({ userId: session.user.id });
      }
    },
  });
  const { mutateAsync: unfollow } = trpc.user.unfollow.useMutation({
    onSuccess: () => {
      utils.user.isFollowing.invalidate({ userId });
      utils.profile.followCount.invalidate({ userId });
      if (session?.user?.id) {
        utils.profile.followCount.invalidate({ userId: session.user.id });
      }
    },
  });

  const handleClick = () => {
    if (!userExists) {
      dialogDispatch({ type: "show", name: "signin" });
      return;
    }
    if (isFollowing) {
      unfollow({ userId });
    } else {
      follow({ userId });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        isFollowing === undefined ? "invisible" : ""
      } w-26 group rounded-full border border-neutral-500 px-3 py-2 font-bold ${
        isFollowing
          ? "w-28 bg-neutral-100 text-neutral-800 hover:bg-red-50 dark:bg-black dark:text-neutral-100"
          : "bg-black text-neutral-300 hover:bg-neutral-800 dark:bg-white dark:text-neutral-700 dark:hover:bg-neutral-200"
      }`}
    >
      <span className="block group-hover:hidden">{isFollowing ? "Following" : "Follow"}</span>
      <span className={`hidden group-hover:block ${isFollowing ? "text-red-500" : ""}`}>
        {isFollowing ? "Unfollow" : "Follow"}
      </span>
    </button>
  );
}
