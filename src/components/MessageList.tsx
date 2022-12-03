import { trpc } from "src/utils/trpc";
import { UserImageLink } from "./Link";

type Props = {
  className?: string;
};

export function MessageList({ className = "" }: Props) {
  const { data: conversations } = trpc.message.conversations.useQuery({});

  return (
    <div className={` ${className}`}>
      <div>MessageList</div>
      <div>
        {conversations?.map((conversation) => (
          <div key={conversation.id} className="flex justify-between">
            <h3>conversation</h3>
            <div className="flex">
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
          </div>
        ))}
      </div>
    </div>
  );
}
