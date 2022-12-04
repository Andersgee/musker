import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  className?: string;
};

export function Header({ className = "" }: Props) {
  const { asPath } = useRouter();
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
}

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
