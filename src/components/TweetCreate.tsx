import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDialogDispatch } from "src/context/DialogContext";
import { trpc } from "src/utils/trpc";
import { UserLink } from "./Link";
import { UserHandleChoose } from "./UserHandleChoose";

type Props = {
  className?: string;
  onClick: (text: string) => Promise<void>;
  disabled: boolean;
  placeholder: string;
};

export function TweetCreate({ onClick, disabled, placeholder, className = "" }: Props) {
  const { data: session } = useSession();
  const userExists = !!session?.user;
  const { data: myHandle } = trpc.user.myHandle.useQuery(undefined, {
    enabled: userExists,
  });
  const dialogDispatch = useDialogDispatch();
  const [showInfoText, setShowInfoText] = useState(false);
  const [showHandlePicker, setShowHandlePicker] = useState(false);
  const [text, setText] = useState("");

  const handleClick = async () => {
    if (!userExists) {
      dialogDispatch({ type: "show", name: "signin" });
      setShowInfoText(true);
    } else if (!myHandle) {
      setShowHandlePicker(true);
      return;
    } else {
      await onClick(text);
      setText("");
    }
  };

  return (
    <div className={` ${className}`}>
      <div className={`mt-2 flex w-full justify-between ${className}`}>
        <UserImage image={session?.user?.image} handle={myHandle} />
        <div className="ml-1 flex-1">
          <div className="flex items-center">
            <textarea
              spellCheck={false}
              className="h-20 w-full p-1"
              aria-label="compose"
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <hr className=" h-px border-0 bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 flex items-baseline justify-between">
            <div></div>
            <div className="flex flex-col items-end">
              <button
                disabled={disabled || !text}
                className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
                onClick={handleClick}
              >
                Tweet
              </button>
              {!userExists && showInfoText && (
                <div className="rounded-full font-bold text-orange-500">need to sign in first</div>
              )}
              {!myHandle && showHandlePicker && <UserHandleChoose />}
            </div>
          </div>
        </div>
        <hr className=" h-px border-0 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

function UserImage({ image, handle }: { image: string | null | undefined; handle: string | null | undefined }) {
  if (image && handle) {
    return (
      <UserLink userHandle={handle} className="w-12">
        <img className="h-12 w-12 rounded-full shadow-imageborder" src={image} alt={handle} />
      </UserLink>
    );
  }

  return <div className="h-12 w-12"></div>;
}
