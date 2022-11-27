//import Link from "next/link";
//import { Stars } from "src/icons/Stars";
//import { Pathname } from "./Pathname";

import { useRouter } from "next/router";

type Props = {
  className?: string;
};

export function Header({ className = "" }: Props) {
  const { asPath } = useRouter();

  //const { data: sessionData } = useSession();
  return (
    <div className={className}>
      <header className="flex h-full items-center justify-between">
        <h1 className="ml-4 font-medium capitalize">{asPath}</h1>
        <div>pot</div>
      </header>
    </div>
  );
}
