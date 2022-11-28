import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  handle: string;
};

export function NavFollows({ handle }: Props) {
  const { pathname } = useRouter();
  return (
    <div className="mt-4 mb-6 flex justify-evenly">
      <NavLink href={`/${handle}/followers_you_know`} active={pathname.endsWith("followers_you_know")}>
        Followers you know
      </NavLink>
      <NavLink href={`/${handle}/followers`} active={pathname.endsWith("followers")}>
        Followers
      </NavLink>
      <NavLink href={`/${handle}/following`} active={pathname.endsWith("following")}>
        Following
      </NavLink>
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
