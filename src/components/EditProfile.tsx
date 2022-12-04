import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDialogContext, useDialogDispatch } from "src/context/DialogContext";
import useEventListener from "src/hooks/useEventListener";
import { useOnClickOutside } from "src/hooks/useOnClickOutside";
import { Button } from "src/ui/Button";
import { trpc } from "src/utils/trpc";

export function EditProfileDialog() {
  const { data: session } = useSession();
  const { editprofile: showEditprofile } = useDialogContext();
  const dialogDispatch = useDialogDispatch();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => dialogDispatch({ type: "hide", name: "editprofile" }));

  const router = useRouter();
  //const utils = trpc.useContext();

  const { mutate: updateBio, isLoading } = trpc.profile.updateBio.useMutation({
    onSuccess: () => {
      //utils.profile.
      router.reload(); // (the mutation has a revalidate call, so this gets new version)
    },
  });

  useEventListener("keydown", (e) => {
    if (showEditprofile && e.code === "Escape") {
      e.preventDefault();
      dialogDispatch({ type: "hide", name: "editprofile" });
    }
  });

  useEffect(() => {
    if (showEditprofile && !session?.user) {
      dialogDispatch({ type: "hide", name: "editprofile" });
    }
  }, [session, showEditprofile, dialogDispatch]);

  const [text, setText] = useState("");

  const handleSave = () => {
    updateBio({ text });
  };

  if (showEditprofile && session?.user) {
    return (
      <>
        <div className="fixed inset-0 z-10 bg-black/30" aria-hidden="true" />
        <div
          ref={ref}
          className="fixed top-1/2 left-1/2 z-20 -translate-y-1/2 -translate-x-1/2 rounded-lg bg-white p-4 shadow-md mainwidth dark:bg-black"
        >
          <h1 className="mb-2 text-lg">Edit profile</h1>
          <textarea
            autoFocus={true}
            className="h-20 w-full p-1"
            aria-label="edit profile"
            placeholder="Profile description"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="w-24 rounded-full border border-neutral-500 bg-white px-3 py-2 font-medium dark:bg-black"
              onClick={() => dialogDispatch({ type: "hide", name: "editprofile" })}
            >
              Cancel
            </button>
            <Button disabled={isLoading} onClick={handleSave} className="w-24 disabled:bg-slate-500">
              {isLoading ? "Saving" : "Save"}
            </Button>
          </div>
        </div>
      </>
    );
  }
  return null;
}
