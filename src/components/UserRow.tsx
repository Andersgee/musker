import { FollowButton } from "src/components/FollowButton";
import { UserLink } from "./Link";
import Image from "next/image";

type Props = {
  userId: string;
  image: string | null;
  handle: string | null;
  className?: string;
};

export function UserRow({ userId, image, handle, className = "" }: Props) {
  return (
    <>
      <div className={`my-4 mx-2 flex ${className}`}>
        <UserLink userHandle={handle} className="group flex h-12 w-12 flex-1 items-center">
          <Image
            className="h-12 w-12 rounded-full shadow-imageborder group-hover:opacity-80 group-hover:transition-opacity"
            src={image || ""}
            alt={handle || ""}
            width={48}
            height={48}
          />
          <h3 className="ml-2 group-hover:opacity-80">{handle}</h3>
        </UserLink>

        <FollowButton userId={userId} />
      </div>
      <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
    </>
  );
}
