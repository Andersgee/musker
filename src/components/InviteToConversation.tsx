import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useDialogContext, useDialogDispatch } from "src/context/DialogContext";
import useEventListener from "src/hooks/useEventListener";
import { useConversationMyInvitableUsersList } from "src/hooks/useInfiniteList";
import { useOnClickOutside } from "src/hooks/useOnClickOutside";
import { IconAdd } from "src/icons/Add";
import { trpc } from "src/utils/trpc";

type Props = {
  conversationId: number;
};

export function InviteToConversationDialog({ conversationId }: Props) {
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const { inviteToConversation: show } = useDialogContext();
  const enabled = userExists && show;

  const dialogDispatch = useDialogDispatch();
  const dialogRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dialogRef, () => dialogDispatch({ type: "hide", name: "inviteToConversation" }));

  const utils = trpc.useContext();
  const {
    ref,
    users: invitableUsers,
    isFetchingNextPage,
  } = useConversationMyInvitableUsersList(enabled, conversationId);

  const { mutate: inviteToConversation, isLoading } = trpc.conversation.inviteToConversation.useMutation({
    onSuccess: () => {
      utils.message.conversationUsers.invalidate({ conversationId });
      utils.conversation.myInvitableUsers.invalidate({ conversationId });
    },
  });

  useEventListener("keydown", (e) => {
    if (show && e.code === "Escape") {
      e.preventDefault();
      dialogDispatch({ type: "hide", name: "inviteToConversation" });
    }
  });

  useEffect(() => {
    if (show && !session?.user) {
      dialogDispatch({ type: "hide", name: "inviteToConversation" });
    }
  }, [session, show, dialogDispatch]);

  const handleAdd = (userId: string) => () => {
    inviteToConversation({ conversationId, userId });
  };

  if (show && session?.user) {
    return (
      <>
        <div className="fixed inset-0 z-10 bg-black/30" aria-hidden="true" />
        <div
          ref={dialogRef}
          className="fixed top-1/2 left-1/2 z-20 -translate-y-1/2 -translate-x-1/2 rounded-lg bg-white p-4 shadow-md mainwidth dark:bg-black"
        >
          <h1 className="mb-2 text-lg">Add to conversation</h1>
          {invitableUsers.length === 0 && (
            <div className="flex flex-col items-center">
              <p>Any people you follow will appear here</p>
              <p>(expect the ones already in the convo)</p>
            </div>
          )}

          {invitableUsers.map(({ user }) => (
            <div key={user.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full shadow-imageborder"
                    src={user.image || undefined}
                    alt={user.handle || undefined}
                  />
                  <h3 className="ml-2">{user.handle}</h3>
                </div>
                <button
                  className="ml-1 h-12 w-12 rounded-full border border-neutral-500 bg-white dark:bg-black"
                  disabled={isLoading}
                  onClick={handleAdd(user.id)}
                >
                  <IconAdd className="h-12 w-12 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>
              <hr className="m-0 my-4 h-px border-0 bg-gray-200 p-0 dark:bg-gray-700" />
            </div>
          ))}

          <div ref={ref} className="mt-4 flex justify-center">
            {isFetchingNextPage ? "loading..." : "."}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              className="w-24 rounded-full border border-neutral-500 bg-white px-3 py-2 font-medium dark:bg-black"
              onClick={() => dialogDispatch({ type: "hide", name: "inviteToConversation" })}
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  }
  return null;
}
