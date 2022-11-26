//import Link from "next/link";
//import { Stars } from "src/icons/Stars";
//import { Pathname } from "./Pathname";

type Props = {
  className?: string;
};

export function Header({ className = "" }: Props) {
  //const { data: sessionData } = useSession();
  return (
    <div className={className}>
      <header className="flex h-full items-center justify-between">
        <h1 className="ml-4 font-medium capitalize">header here</h1>
        <div>pot</div>
      </header>
    </div>
  );
}
