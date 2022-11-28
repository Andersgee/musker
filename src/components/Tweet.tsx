import { formatCreatedAt } from "src/utils/date";
import { TweetLink, UserLink } from "./Link";
import { TweetActions } from "./TweetActions";

type Props = {
  id: number;
  image: string | null;
  handle: string | null;
  createdAt: Date;
  text: string;
  className?: string;
};

export function Tweet({ id, handle, image, createdAt, text, className = "" }: Props) {
  return (
    <article className={`flex ${className}`}>
      <UserLink userHandle={handle} className="mt-2 h-12 w-12">
        <img className="h-12 w-12 rounded-full shadow-imageborder" src={image || undefined} alt={handle || undefined} />
      </UserLink>
      <div className="flex-1">
        <TweetLink userHandle={handle} tweetId={id}>
          <div className="px-2 pt-4 pb-2  hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 className="text-base font-normal">
              {handle} - {formatCreatedAt(createdAt)}
            </h3>
            <pre className="text-tweet">{text}</pre>
          </div>
        </TweetLink>
        <TweetActions userHandle={handle} tweetId={id} />
      </div>
    </article>
  );
}
