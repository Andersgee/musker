export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

/** allow relative urls such as "/about" */
export function absUrl(url: string) {
  if (!url) return url;

  const baseUrl = getBaseUrl();
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  } else {
    return url;
  }
}
