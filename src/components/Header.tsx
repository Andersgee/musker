//import Link from "next/link";
//import { Stars } from "src/icons/Stars";
//import { Pathname } from "./Pathname";

import { useRouter } from "next/router";
import { UserLink } from "./Link";

type Props = {
  className?: string;
};

export function Header({ className = "" }: Props) {
  const { asPath } = useRouter();
  const isHome = asPath === "/";
  const isFollowPage =
    asPath.endsWith("followers_you_know") || asPath.endsWith("followers") || asPath.endsWith("following");

  //const { data: sessionData } = useSession();
  if (isFollowPage) {
    const userHandle = asPath.split("/").at(1) || null;

    return (
      <div className={className}>
        <header className="flex h-full items-center justify-between border-b backdrop-blur-sm">
          <UserLink userHandle={userHandle}>
            <h1 className="ml-4 font-medium capitalize">{userHandle}</h1>
          </UserLink>
          <div></div>
        </header>
      </div>
    );
  }

  return (
    <div className={className}>
      <header className="flex h-full items-center justify-between border-b backdrop-blur-sm">
        <h1 className="ml-4 font-medium capitalize">{isHome ? "Latest Tweets" : asPath.slice(1)}</h1>
        <div>opt</div>
      </header>
    </div>
  );
}
