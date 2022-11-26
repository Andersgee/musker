function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

/** allow relative urls such as "/about" */
export function absUrl(url?: string) {
  if (!url) return url;

  const baseUrl = getBaseUrl();
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  } else {
    return url;
  }
}

type Props = {
  /**
   * The title of your object as it should appear within the graph, e.g., "The Rock".
   */
  title: string;
  /**
   * The type of your object, e.g., "website" or "video.movie". Depending on the type you specify, other properties may also be required.
   */
  type?: string;
  /**
   * An image URL which should represent your object within the graph.
   *
   * size should be 1200x630 to be safe
   */
  image: string;
  /**
   * The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "https://www.imdb.com/title/tt0117500".
   */
  url: string;
  /**
   * A URL to an audio file to accompany this object. example "https://example.com/bond/theme.mp3"
   */
  audio?: string;
  /**
   * A one to two sentence description of your object.
   */
  description: string;
  /**
   * The word that appears before this object's title in a sentence. An enum of (a, an, the, "", auto). If auto is chosen, the consumer of your data should chose between "a" or "an". Default is "" (blank).
   */
  determiner?: string;
  /**
   *  The locale these tags are marked up in. Of the format language_TERRITORY. Default is en_US.
   */
  locale?: string;
  /**
   * An array of other locales this page is available in.
   */
  locale_alternatives?: string[];
  /**
   * If your object is part of a larger web site, the name which should be displayed for the overall site. e.g., "IMDb".
   */
  site_name?: string;
  /**
   * A URL to a video file that complements this object.
   */
  video?: string;
};

/**
 * meta tags for SEO, with sensible required fields although technically nothing is required.
 *
 * NOTE: for convenience, this function allows relative url such as `"/about"` instead of `"https://some.page.com/about"`
 *
 * reference:
 * https://ogp.me/
 * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
 * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
 * https://api.slack.com/robots
 *
 *
 * testing:
 * facebook: https://developers.facebook.com/tools/debug/
 * google: https://developers.google.com/search/docs/appearance/structured-data
 * twitter: https://cards-dev.twitter.com/validator
 * slack: apparently uses same as twitter
 *
 * EXPERIMENTAL:
 * at the moment title will not update on client navigation without hacky stuff:
 * https://beta.nextjs.org/docs/api-reference/file-conventions/head
 *
 * EXPERIMENTAL2:
 * apparently putting a comment after a tag breaks build. so put comments on their own lines
 */
export function SEO({
  title,
  type = "website",
  site_name = "Musker",
  url,
  image,
  audio,
  description,
  determiner,
  locale,
  locale_alternatives,
  video,
}: Props) {
  return (
    <>
      {/* basic */}
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* adress bar color, same as bgcolor looks good. */}
      <meta name="theme-color" content="#FAFAFA" />
      {/* manifest and icons */}
      {/*<link rel="manifest" href={absUrl("/manifest.json")} />*/}
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
      <link rel="icon" type="image/png" href="/icons/favicon.png" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon-192x192.png" />

      {/* OG Metadata */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={site_name} />
      <meta property="og:url" content={absUrl(url)} />
      <meta property="og:image" content={absUrl(image)} />
      {audio && <meta property="og:audio" content={absUrl(audio)} />}
      {video && <meta property="og:video" content={absUrl(video)} />}
      {determiner && <meta property="og:determiner" content={determiner} />}
      {locale && <meta property="og:locale" content={locale} />}
      {locale_alternatives?.map((alternative) => (
        <meta key={alternative} property="og:locale:alternate" content={alternative} />
      ))}
      {/* Twitter card */}
      <meta name="twitter:card" content="summary_large_image" />
      {/* twitter uses og tags for these if not provided so not needed.
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      */}
      {/* attribution (when creator has twitter account)
      <meta name="twitter:site" content="@nytimes" />
      <meta name="twitter:creator" content="@SarahMaslinNir" />
      */}
    </>
  );
}
