import { type NextPage } from "next";
import Link from "next/link";
import { MessageList } from "src/components/MessageList";
import { SEO } from "src/components/SEO";

import { IconMusker } from "src/icons/Musker";
import { hashidFromNumber } from "src/utils/hashids";
import { trpc } from "src/utils/trpc";
import { formatCreatedAt } from "src/utils/date";

const Page: NextPage = () => {
  const { data: conversations } = trpc.message.conversations.useQuery({});

  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/messages" image="/og/musker.png" />
      {!conversations && <IconMusker />}

      <div>
        {conversations?.map((conversation) => (
          <Link
            href={`/messages/${hashidFromNumber(conversation.id)}`}
            key={conversation.id}
            className="group flex items-center justify-between gap-2"
          >
            <div className="text-base font-medium">{formatCreatedAt(conversation.lastActivityAt)}</div>
            <p className="truncate group-hover:opacity-80">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro qui officiis accusamus dolorum? Non,
              accusantium ipsa beatae placeat vel doloremque!
            </p>
            <div className="flex flex-shrink-0">
              {conversation.users.map(({ user }) => (
                <div key={`${conversation.id}-${user.id}`} className="ml-[-24px]">
                  <img
                    className="h-12 w-12 rounded-full shadow-imageborder group-hover:opacity-80 group-hover:transition-opacity"
                    src={user.image || undefined}
                    alt={user.handle || undefined}
                  />
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Page;
