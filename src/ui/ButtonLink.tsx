import Link from "next/link";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({ href, children, className = "", ...rest }: Props) {
  return (
    <Link
      href={href}
      className={`rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300 ${className}`}
    >
      {children}
    </Link>
  );
}
