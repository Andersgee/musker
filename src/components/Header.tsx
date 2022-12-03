//import Link from "next/link";
//import { Stars } from "src/icons/Stars";
//import { Pathname } from "./Pathname";

import Link from "next/link";
import { useRouter } from "next/router";
import { UserLink } from "./Link";
import { NavFollows } from "./NavFollows";

type Props = {
  className?: string;
};

export function Header({ className = "" }: Props) {
  const { asPath, pathname } = useRouter();
  const as = asPath.split("/").slice(1);
  const as0 = as.at(0);

  if (as0 == "") {
    return (
      <Layout className={className}>
        <h1>Latest Tweets</h1>
      </Layout>
    );
  }

  return (
    <Layout className={className}>
      <Link href={`/${as0}`}>
        <h1>{decodeURIComponent(as0 || "")}</h1>
      </Link>
    </Layout>
  );
  /*
  const as1 = as.at(1);

  const ps = pathname.split("/").slice(1);
  const ps0 = ps.at(0);
  const ps1 = ps.at(1);

  const is_home = pathname === "/";

  const is_profile_page = ps0 === "[handle]" && ps.length == 1;

  const is_following = ps1 === "following";
  const is_followers = ps1 === "followers";
  const is_followers_you_know = ps1 === "followers_you_know";
  const is_follows_page = is_following || is_followers || is_followers_you_know;

  const show_go_to_user = ps0 === "[handle]" && ps.length > 1;

  if (is_home) {
    return <Layout className={className}>Latest Tweets</Layout>;
  }

  if (show_go_to_user) {
    return (
      <Layout className={className}>
        <UserLink userHandle={as0 || ""}>go to {as0}</UserLink>
      </Layout>
    );
  }

  if (is_profile_page) {
    return (
      <Layout className={className}>
        <h1>{as0}</h1>
      </Layout>
    );
  }

  return (
    <Layout className={className}>
      <h1>{ps0}</h1>
    </Layout>
  );
  */
}

//<h1 className="ml-4 font-medium capitalize">{isHome ? "Latest Tweets" : asPath.slice(1)}</h1>

type LayoutProps = {
  className: string;
  children: React.ReactNode;
};

function Layout({ children, className }: LayoutProps) {
  return (
    <div className={className}>
      <header className="flex h-full items-center justify-between border-b backdrop-blur-sm">
        <div className="ml-4 font-medium capitalize">{children}</div>
        <div></div>
      </header>
    </div>
  );
}
