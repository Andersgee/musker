import "../styles/globals.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { Nav } from "src/components/Nav";
import { Header } from "src/components/Header";
import { ThemeProvider } from "next-themes";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider session={session}>
        <div
          className="container grid 
              grid-cols-phone grid-rows-phone
              sm:grid-cols-sm sm:grid-rows-sm md:grid-cols-md lg:grid-cols-lg xl:grid-cols-xl 2xl:grid-cols-2xl 3xl:grid-cols-3xl"
        >
          <Nav className="fixed bottom-0 h-12 w-full border-t sm:h-full sm:w-16 sm:border-t-0 md:w-20 3xl:w-72" />
          <Header className="fixed h-12 mainwidth sm:ml-16 md:ml-20 3xl:ml-72" />
          <main className="row-start-2 mainwidth sm:col-start-2">
            <Component {...pageProps} />
          </main>
          <aside className="hidden xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:block">
            <article className="px-2 pt-1">
              <h2>What is this?</h2>
              <p>Musker is a twitter clone for fun.</p>
            </article>
          </aside>
        </div>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
