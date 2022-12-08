import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "src/components/SEO";
import { IconMusker } from "src/icons/Musker";
import { hashidFromNumber } from "src/utils/hashids";
import { trpc } from "src/utils/trpc";
import { formatCreatedAt } from "src/utils/date";
import { IconDate } from "src/icons/Date";

const Page: NextPage = () => {
  const { data: conversations } = trpc.message.conversations.useQuery({});

  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/messages" image="/og/musker.png" />
      {!conversations && <IconMusker />}

      <div>
        {conversations?.map((conversation) => (
          <div key={conversation.id}>
            <Link
              href={`/messages/${hashidFromNumber(conversation.id)}`}
              className="group flex items-center justify-between gap-2 px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <div className="flex gap-2">
                <div className="flex items-center gap-0.5">
                  <IconDate className="h-4 w-4" />
                  <div className="text-base font-medium">{formatCreatedAt(conversation.lastActivityAt)}</div>
                </div>
                <div className="flex w-60 justify-start">
                  <p className="truncate group-hover:opacity-80">{conversation.messages?.[0]?.text}</p>
                </div>
              </div>
              <div className="flex flex-shrink-0">
                {conversation.users.map(({ user }) => (
                  <div key={`${conversation.id}-${user.id}`} className="ml-[-24px]">
                    <Image
                      className="h-12 w-12 rounded-full shadow-imageborder group-hover:opacity-80 group-hover:transition-opacity"
                      src={user.image || ""}
                      alt={user.handle || ""}
                      width={48}
                      height={48}
                    />
                  </div>
                ))}
              </div>
            </Link>
            <hr className="m-0 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
