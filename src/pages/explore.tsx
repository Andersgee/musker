import { type NextPage } from "next";
import { ExploreList } from "src/components/ExploreList";
import { SEO } from "src/components/SEO";

const Page: NextPage = () => {
  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/explore" image="/og/musker.png" />
      <ExploreList />
    </>
  );
};

export default Page;
