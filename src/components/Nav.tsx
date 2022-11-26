import Link from "next/link";
import React from "react";
import { IconExplore } from "src/icons/Explore";
import { IconHome } from "src/icons/Home";
import { IconMessages } from "src/icons/Messages";
import { IconNotifications } from "src/icons/Notifications";

type Props = {
  className?: string;
};

export function Nav({ className = "" }: Props) {
  return (
    <nav className={` ${className}`}>
      <ul className="flex items-center sm:flex-col lg:items-start">
        <li className="w-full flex-1">
          <NavLink href="/" label="Home">
            <IconHome className="h-7 w-7  group-hover:text-blue-500" />
          </NavLink>
        </li>
        <li className="w-full flex-1">
          <NavLink href="/explore" label="Explore">
            <IconExplore className="h-7 w-7  group-hover:text-blue-500" />
          </NavLink>
        </li>
        <li className="w-full flex-1">
          <NavLink href="/notifications" label="Notifications">
            <IconNotifications className="h-7 w-7  group-hover:text-blue-500" />
          </NavLink>
        </li>
        <li className="w-full flex-1">
          <NavLink href="/messages" label="Messages">
            <IconMessages className="h-7 w-7  group-hover:text-blue-500" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function NavLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex h-12 items-center justify-center 3xl:justify-start 3xl:pl-8">
      {children}
      <span className="ml-4 hidden 3xl:block">{label}</span>
    </Link>
  );
}
