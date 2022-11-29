import type { NextPage } from "next";
import { SEO } from "src/components/SEO";

const Page: NextPage = () => {
  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/terms" image="/og/musker.png" />
      <div className="flex justify-center p-4">
        <div className="">
          <h1 className="text-4xl font-extrabold leading-normal text-gray-700">terms of service</h1>
          <ul className="list-disc space-y-2">
            <li>
              <p>Musker is a twitter clone made for fun. It may be discontinued without notice.</p>
            </li>
            <li>
              <p>Dont spam/abuse the service or create offensive content.</p>
            </li>
            <li>
              <p>
                Misuse of the service in any way deemed inappropriate by the creators may result in removal of your
                account.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Page;
