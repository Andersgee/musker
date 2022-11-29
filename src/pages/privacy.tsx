import type { NextPage } from "next";
import { SEO } from "src/components/SEO";

const Page: NextPage = () => {
  return (
    <>
      <SEO title="musker" description="A twitter clone" url="/privacy" image="/og/musker.png" />
      <div className="flex justify-center p-4">
        <div className="">
          <h1 className="text-4xl font-extrabold leading-normal text-gray-700">privacy policy</h1>
          <p>
            This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how
            you can delete your information.
          </p>
          <hr className="my-4" />
          <h2>Summary</h2>
          <p>
            We dont gather any information except that which is necessary to use the site. You can delete any personal
            information by deleting your account.
          </p>

          <h2 className="mt-4">Cookies</h2>
          <p>
            Cookies are small pieces of text sent to your browser by a website that helps remember information about
            your visit.
          </p>
          <p>
            Musker uses cookies to remember you, so that you dont have to manually sign in every time you visit the
            site.
          </p>

          <h2 className="mt-4">Things you create or provide to us</h2>
          <p>
            When you create an account, you provide us with basic personal information like name, email and profile
            image.
          </p>

          <p>We also store the content you create, upload, or receive from others when using our services.</p>

          <h2 className="mt-4">Deleting your information</h2>
          <p>You can delete your account.</p>
        </div>
      </div>
    </>
  );
};

export default Page;
