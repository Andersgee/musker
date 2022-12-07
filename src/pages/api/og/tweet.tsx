import type { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { absUrl } from "src/utils/url";
import { kysely } from "src/server/db/kysely";
import { numberFromHashid } from "src/utils/hashids";

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

export const config = {
  runtime: "experimental-edge",
  regions: "iad1",
};

/**
 * return an image from url such as `/api/og/tweet?hashId=abcde`
 */
export default async function handler(req: NextRequest) {
  try {
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
    console.log({ tweet });

    if (!tweet) {
      return new Response(`no tweet`, { status: 500 });
    }

    //const tweet = { text: "lalalala" };

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "black",
            backgroundSize: "150px 150px",
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div tw="flex flex-col text-white items-center">
            <div>img</div>
            <div tw="flex flex-col items-center justify-center pt-6">
              <p tw="font-bold p-0 m-0 text-xl">Musker / A Twitter clone</p>
              <p tw="font-bold p-0 m-0 mt-1 text-xl">{tweet.text}</p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
