import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserImageLink } from "src/components/Link";
import { SEO } from "src/components/SEO";

import { numberFromHashid } from "src/utils/hashids";
import { trpc } from "src/utils/trpc";
import { formatCreatedAt } from "src/utils/date";
import { useState } from "react";

const Page: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const conversationId = numberFromHashid(router.query.hashId as string);
  const utils = trpc.useContext();

  const { data: conversation } = trpc.message.messages.useQuery(
    { conversationId },
    {
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
      enabled: userExists && conversationId !== undefined,
    },
  );

  const { mutateAsync: create } = trpc.message.create.useMutation({
    onSuccess: () => utils.message.messages.invalidate({ conversationId }),
  });

  const [text, setText] = useState("");
  const disabled = false;

  const handleClick = async () => {
    if (conversationId !== undefined && text.length < 280) {
      await create({ conversationId, text });
      setText("");
    }
  };

  if (!userExists || !conversationId) {
    return <div></div>;
  }

  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/messages" image="/og/musker.png" />
      <div className="px-0 mainwidth sm:px-1">
        <textarea
          spellCheck={false}
          className="h-20 w-full p-2"
          aria-label="compose"
          placeholder="Your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="mt-1 flex justify-end">
        <button
          disabled={disabled || !text}
          className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
          onClick={handleClick}
        >
          Send
        </button>
      </div>
      <div className="flex flex-col">
        {conversation?.messages.map((message) => {
          if (message.senderId === session.user?.id) {
            return (
              <div key={message.id}>
                <div className="my-2 flex justify-end gap-2">
                  <div className="flex w-4/5 flex-col items-end">
                    <pre className="mt-1 rounded-lg bg-blue-200 p-2 text-tweet">{message.text}</pre>
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
                <pre className="mt-1 rounded-lg bg-blue-200 p-2 text-tweet">{message.text}</pre>

                <div className="text-xs">{formatCreatedAt(message.createdAt)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Page;
