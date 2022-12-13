import { IconGithub } from "src/icons/Github";

type Props = {
  className?: string;
};

export function Aside({ className = "" }: Props) {
  return (
    <aside className={className}>
      <article className="ml-2 px-2 pt-2">
        <h2>What is this?</h2>
        <p>Musker is a twitter clone for fun.</p>
        <a href="https://github.com/Andersgee/musker" className="mt-2 flex items-center gap-2">
          <IconGithub className="h-6 w-6 rounded-full border-black fill-black dark:fill-white" />
          source on github
        </a>
      </article>
    </aside>
  );
}
