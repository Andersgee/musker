import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { SEO } from "src/components/SEO";
import { useDialogDispatch } from "src/context/DialogContext";
import { IconMusker } from "src/icons/Musker";

const Page: NextPage = () => {
  const dispatch = useDialogDispatch();
  const { data: session } = useSession();
  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/" image="/og/musker.png" />
      <div>
        <button
          onClick={() => {
            console.log("show..");
            dispatch({ type: "show", name: "signin" });
          }}
        >
          SHOW SIGN IN{" "}
        </button>
        <div>{JSON.stringify(session)}</div>
        <IconMusker />
        <div className="mb-4">home... work in progress</div>
      </div>
    </>
  );
};

export default Page;
