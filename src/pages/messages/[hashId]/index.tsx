import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserImageLink } from "src/components/Link";
import { SEO } from "src/components/SEO";

import { numberFromHashid } from "src/utils/hashids";
import { trpc } from "src/utils/trpc";
import { formatCreatedAt } from "src/utils/date";
import { IconAdd } from "src/icons/Add";
import { useMessagesList } from "src/hooks/useInfiniteList";
import { MessageCreate } from "src/components/MessageCreate";
import { InviteToConversationDialog } from "src/components/InviteToConversation";
import { useDialogDispatch } from "src/context/DialogContext";

const Page: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const conversationId = numberFromHashid(router.query.hashId as string) as number;
  const utils = trpc.useContext();
  const dialogDispatch = useDialogDispatch();

  const { messages, ref, isFetchingNextPage } = useMessagesList(
    userExists && conversationId !== undefined,
    conversationId,
  );

  const { data: users } = trpc.message.conversationUsers.useQuery(
    { conversationId },
    {
      enabled: userExists && conversationId !== undefined,
    },
  );

  const { mutateAsync: create } = trpc.message.create.useMutation({
    onSuccess: () => utils.message.conversationMessages.invalidate({ conversationId }),
  });

  const onClick = async (text: string) => {
    if (conversationId !== undefined && text.length < 280) {
      await create({ conversationId, text });
    }
  };

  if (!userExists || conversationId === undefined) {
    return <div></div>;
  }

  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/messages" image="/og/musker.png" />
      <InviteToConversationDialog conversationId={conversationId} />
      <div className="my-2 mr-2 flex items-center justify-end">
        {users?.map(({ user }) => (
          <div key={user.id} className="ml-1">
            <UserImageLink handle={user.handle} image={user.image} />
          </div>
        ))}
        <button
          className="ml-1 h-12 w-12 rounded-full border border-neutral-500 bg-white dark:bg-black"
          onClick={() => dialogDispatch({ type: "show", name: "inviteToConversation" })}
        >
          <IconAdd className="h-12 w-12 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>
      <MessageCreate disabled={false} placeholder="Your message" onClick={onClick} />
      <div className="mx-2 flex flex-col">
        {messages.map((message) => {
          if (message.senderId === session.user?.id) {
            return (
              <div key={message.id}>
                <div className="my-2 flex justify-end gap-2">
                  <div className="flex w-4/5 flex-col items-end">
                    <pre className="mt-1 rounded-lg bg-blue-200 p-2 text-black text-tweet dark:text-black">
                      {message.text}
                    </pre>
                    <div className="text-xs">{formatCreatedAt(message.createdAt)}</div>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={message.id} className="my-2 flex w-4/5">
              <UserImageLink handle={message.sender.handle} image={message.sender.image} />
              <div className="mt-2 flex flex-col items-start">
                <pre className="mt-1 rounded-lg bg-neutral-200 p-2 text-black text-tweet dark:bg-neutral-300 dark:text-black">
                  {message.text}
                </pre>

                <div className="text-xs">{formatCreatedAt(message.createdAt)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={ref} className="mt-4 flex justify-center">
        {isFetchingNextPage ? "loading..." : "."}
      </div>
    </>
  );
};

export default Page;
