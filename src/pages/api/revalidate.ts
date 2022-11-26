import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";

/**
 * example path "/blog/post-1"
 *
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { key, path } = req.query;
  if (typeof key !== "string" || key !== env.FETCH_KEY) {
    return res.status(401).end();
  }

  if (typeof path !== "string" || !path.startsWith("/")) {
    return res.status(404).send("bad path");
  }

  try {
    await res.revalidate(path);
    return res.status(200).send("ok");
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
