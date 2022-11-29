import { type NextPage } from "next";
import { SEO } from "src/components/SEO";

import { IconMusker } from "src/icons/Musker";

const Page: NextPage = () => {
  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/messages" image="/og/musker.png" />

      <div>
        <IconMusker />
        <div className="mb-4">messages... work in progress</div>
      </div>
    </>
  );
};

export default Page;
