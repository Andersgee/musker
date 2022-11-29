import { FollowButton } from "src/components/FollowButton";
import { UserLink } from "./Link";

type Props = {
  userId: string;
  image: string | null;
  handle: string | null;
  className?: string;
};

export function UserRow({ userId, image, handle, className = "" }: Props) {
  return (
    <>
      <div className={`my-4 flex ${className}`}>
        <UserLink userHandle={handle} className="flex flex-1 items-center">
          <img src={image || undefined} alt={handle || undefined} className="h-8 w-8 rounded-full shadow-imageborder" />
          <h3>{handle}</h3>
        </UserLink>
        <FollowButton userId={userId} />
      </div>
      <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
    </>
  );
}
