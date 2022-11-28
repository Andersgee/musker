import { useSession } from "next-auth/react";
import { useId, useState } from "react";
import { Button } from "src/ui/Button";
import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
};

export function UserHandleChoose({ className = "" }: Props) {
  const { data: session } = useSession();
  const userExists = !!session?.user;

  const utils = trpc.useContext();
  const id = useId();
  const [text, setText] = useState("");
  const { data: myHandle } = trpc.user.myHandle.useQuery(undefined, { enabled: userExists });
  const { data: existingHandle } = trpc.handle.getByText.useQuery({ text }, { enabled: userExists });

  const { mutateAsync: updateMyHandle } = trpc.handle.update.useMutation({
    onSuccess: () => {
      utils.handle.getByText.invalidate();
      utils.user.myHandle.invalidate();
    },
  });

  return (
    <div className={className}>
      <label htmlFor={id} className="font-paragraph block">
        choose handle
      </label>
      <input type="text" placeholder={myHandle || "name"} onChange={(e) => setText(e.target.value)} />
      <Button
        disabled={!!existingHandle || text.length < 3}
        className="mr-1"
        onClick={async () => {
          try {
            updateMyHandle({ text });
          } catch (error) {}
        }}
      >
        {myHandle ? "Pick" : "Create"}
      </Button>
      {existingHandle && <span className="text-sm">(not available)</span>}
      {text.length < 3 && <span className="text-sm">(min 3 chars)</span>}
    </div>
  );
}
