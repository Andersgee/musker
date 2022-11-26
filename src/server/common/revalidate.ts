import { env } from "src/env/server.mjs";
import { absUrl } from "src/utils/url";

/**
 * utility for calling /api/revalidate
 *
 * NOTE: this should only be called server side.
 */
export async function revalidate(path: string) {
  return fetch(absUrl(`/api/revalidate?key=${env.FETCH_KEY}&path=${path}`));
}
