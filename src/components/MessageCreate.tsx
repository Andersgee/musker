import { useState } from "react";
import useEventListener from "src/hooks/useEventListener";

type Props = {
  onClick: (text: string) => Promise<void>;
  disabled: boolean;
  placeholder: string;
};

export function MessageCreate({ onClick, disabled, placeholder }: Props) {
  const [text, setText] = useState("");

  const handleClick = async () => {
    try {
      await onClick(text);
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  useEventListener("keydown", (e) => {
    //https://help.twitter.com/en/using-twitter/direct-messages
    if (e.shiftKey && e.code === "Enter") {
      //new line
      e.preventDefault();
      setText((prev) => `${prev}\n`);
    } else if (e.code === "Enter") {
      //send
      e.preventDefault();
      handleClick();
    }
  });

  return (
    <>
      <div className="px-0 mainwidth sm:px-1">
        <textarea
          spellCheck={false}
          className="h-20 w-full p-2"
          aria-label="compose"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="mx-2 mt-1 flex justify-end">
        <button
          disabled={disabled || !text}
          className="rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300"
          onClick={handleClick}
        >
          Send
        </button>
      </div>
    </>
  );
}
