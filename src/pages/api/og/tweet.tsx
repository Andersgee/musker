/* eslint-disable jsx-a11y/alt-text */
import type { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { absUrl } from "src/utils/url";
import { kysely } from "src/server/db/kysely";
import { numberFromHashid } from "src/utils/hashids";
import { format } from "date-fns";

/*
note to self:

- vercel/og only works in edge runtime,
  https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation#limits 

- because function makes db requst, its better to only run this in the region closest to db
  https://vercel.com/docs/concepts/edge-network/regions#setting-edge-function-regions
  available strings: https://vercel.com/docs/concepts/edge-network/regions#region-list

- because edge runtime, can not use prisma, but planetscales has "fetch compatible" driver (with raw query strings)
  https://github.com/planetscale/database-js
  example: https://github.com/planetscale/f1-championship-stats/blob/main/examples/vercel/api/data.json.ts

- actually, there is a nice query builder (kysely + kysely-planetscale) compatible with planetscale/database-js
  use that instead.

- tailwind is more or less allowed via "tw" attribute.
  https://vercel.com/docs/concepts/functions/edge-functions/og-image-examples#using-tailwind-css---experimental  
  intellisense: add "tw" in tailwind extension settings

- also, if this was not an edge function we could just use a trpc procedure
  https://create.t3.gg/en/usage/trpc#expose-a-single-procedure-externally

- also, is encodeURIComponent(svgString) the only way to use svg?
*/

// Make sure the font exists in the specified path:
const font = fetch(new URL("../../../assets/Montserrat-Regular.ttf", import.meta.url)).then((res) => res.arrayBuffer());

export const config = {
  runtime: "experimental-edge",
  regions: "iad1",
};

/**
 * return an image from url such as `/api/og/tweet?hashId=abcde`
 */
export default async function handler(req: NextRequest) {
  try {
    const fontData = await font;

    const hashId = req.nextUrl.searchParams.get("hashId");
    if (!hashId) {
      return new Response(`bad hashId`, { status: 500 });
    }

    const tweetId = numberFromHashid(hashId);
    if (!tweetId) {
      return new Response(`bad tweetId`, { status: 500 });
    }

    const tweet = await kysely.connection().execute((db) => {
      return db.selectFrom("Tweet").where("Tweet.id", "=", tweetId).selectAll().executeTakeFirst();
    });

    if (!tweet) {
      return new Response(`no tweet`, { status: 500 });
    }

    const author = await kysely.connection().execute((db) => {
      return db.selectFrom("User").where("User.id", "=", tweet.authorId).selectAll().executeTakeFirst();
    });
    if (!author) {
      return new Response(`no author`, { status: 500 });
    }

    //console.log({ tweet, author });

    const image = author.image ? absUrl(author.image) : undefined;

    //const tweet = { text: "lalalala" };

    const createdAt = format(tweet.createdAt, "MMM dd");

    //console.log({ createdAt });
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "#171717",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div tw="flex text-white">
            <img tw="w-12 h-12 mr-2" src={image} />
            <div tw="flex flex-col items-start max-w-lg">
              <h2 tw="flex text-white text-lg m-0">
                {author.handle} - {createdAt}
              </h2>
              <pre tw="text-left font-bold p-0 m-0 mt-1 text-lg text-neutral-300">{tweet.text}</pre>

              <div tw="flex mt-4 justify-between w-[150px] mb-0 pb-0">
                <svg
                  fill="none"
                  strokeWidth="20"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                >
                  <path
                    stroke="none"
                    fill="white"
                    d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
                  />
                </svg>

                <svg
                  fill="none"
                  strokeWidth="20"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                >
                  <path
                    stroke="none"
                    fill="white"
                    d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                  />
                </svg>

                <svg
                  fill="none"
                  strokeWidth="20"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                >
                  <path
                    stroke="none"
                    fill="white"
                    d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 315,
        fonts: [
          {
            name: "Montserrat",
            data: fontData,
            style: "normal",
            weight: 400,
          },
        ],
      },
    );
  } catch {
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
