import { signIn } from "next-auth/react";
import Link from "next/link";
import { IconDiscord } from "src/icons/Discord";
import { IconGithub } from "src/icons/Github";
import { IconGoogle } from "src/icons/Google";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useDialogContext, useDialogDispatch } from "src/context/DialogContext";
import { useOnClickOutside } from "src/hooks/useOnClickOutside";

export function SignInDialog() {
  const { signin: showSignIn } = useDialogContext();
  const dialogDispatch = useDialogDispatch();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => dialogDispatch({ type: "hide", name: "signin" }));

  const { data: session } = useSession();
  useEffect(() => {
    if (showSignIn && session?.user) {
      dialogDispatch({ type: "hide", name: "signin" });
    }
  }, [session, showSignIn, dialogDispatch]);

  if (showSignIn && !session?.user) {
    return (
      <div ref={ref} className="fixed top-0 right-0 z-10 border-2 bg-neutral-50 shadow-md ">
        <SigninButtons />
      </div>
    );
  }

  return null;
}

/**
 * check /api/auth/providers for a list of configured providers
 */
const CONFIGURED_PROVIDERS = {
  discord: { id: "discord", name: "Discord" },
  github: { id: "github", name: "GitHub" },
  google: { id: "google", name: "Google" },
};

/**
 * Keep same look (light mode) always.
 */
export function SigninButtons({ className = "" }: { className?: string }) {
  const onClick = (providerId: string) => () => {
    signIn(providerId);
  };

  return (
    <div className={`flex w-full justify-center ${className}`}>
      <div className="bg-white p-4">
        {Object.values(CONFIGURED_PROVIDERS).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={onClick(provider.id)}
              className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
            >
              <ProviderIcon name={provider.name} className="mr-1 h-7" />
              <span>Sign in with {provider.name}</span>
            </button>
          </div>
        ))}
        <p className="mt-3 w-64 text-center font-serif text-sm text-neutral-600 dark:text-neutral-600">
          By signing in, you agree to our <br />
          <Link
            className="text-neutral-600 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="text-neutral-600 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500"
            href="/privacy"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export function ProviderIcon({ name, className = "" }: { name: string; className?: string }) {
  if (name === "GitHub") {
    return <IconGithub width={32} height={32} className={className} />;
  } else if (name === "Discord") {
    return <IconDiscord width={38} height={32} className={className} />;
  } else if (name === "Google") {
    return <IconGoogle width={32} height={32} className={className} />;
  } else {
    return <div>{name}</div>;
  }
}
