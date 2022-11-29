import { useMemo } from "react";
import { trpc } from "src/utils/trpc";
import { UseIntersectionObserverCallback } from "./useIntersectionObserverCallback";

//lets put these snippets, which occur all over the place with slight variations, in one place

/**
 * `trpc.follows.following` for `[handle]/following`
 */
export function useFollowingList(enabled: boolean, userId: string) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.follows.following.useInfiniteQuery(
    { userId: userId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  const follows = useMemo(() => data?.pages.map((page) => page.items).flat() || [], [data]);
  return { follows, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.follows.followers` for `[handle]/followers`
 */
export function useFollowersList(enabled: boolean, userId: string) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.follows.followers.useInfiniteQuery(
    { userId: userId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  const follows = useMemo(() => data?.pages.map((page) => page.items).flat() || [], [data]);
  return { follows, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.follows.knownFollowers` for `[handle]/known_followers`
 */
export function useKnownFollowersList(enabled: boolean, userId: string) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.follows.knownFollowers.useInfiniteQuery(
    { userId: userId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  const follows = useMemo(() => data?.pages.map((page) => page.items).flat() || [], [data]);
  return { follows, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.explore.tweets` for `/explore`
 */
export function useExploreList() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.explore.tweets.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweets = useMemo(() => data?.pages.map((page) => page.items).flat() || [], [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  return { tweets, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.profile.tweetsWithReplies` for `/[handle]/with_replies`
 */
export function useProfileTweetsWithRepliesList(enabled: boolean, userId: string) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.tweetsWithReplies.useInfiniteQuery(
    { userId: userId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweetsAndRetweets = useMemo(() => {
    //flatten and sort by createdAt, (using the retweets own createdAt)
    const tweets = data?.pages.map((page) => page.items.tweets).flat() || [];
    const retweets = data?.pages.map((page) => page.items.retweets).flat() || [];
    const all = [...tweets, ...retweets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return all;
  }, [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  return { tweetsAndRetweets, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.profile.tweets` for `/[handle]`
 */
export function useProfileTweetsList(enabled: boolean, userId: string) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.tweets.useInfiniteQuery(
    { userId: userId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweetsAndRetweets = useMemo(() => {
    //flatten and sort by createdAt, (using the retweets own createdAt)
    const tweets = data?.pages.map((page) => page.items.tweets).flat() || [];
    const retweets = data?.pages.map((page) => page.items.retweets).flat() || [];
    const all = [...tweets, ...retweets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return all;
  }, [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  return { tweetsAndRetweets, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.profile.likes` for `/[handle]/likes`
 */
export function useProfileLikesList(enabled: boolean, userId: string) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.profile.likes.useInfiniteQuery(
    { userId: userId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });
  const tweetLikes = useMemo(() => data?.pages.map((page) => page.items).flat() || [], [data]);

  return { tweetLikes, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.tweet.replies` for `/[handle]/[hashId]`
 */
export function useTweetRepliesList(enabled: boolean, tweetId: number) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.tweet.replies.useInfiniteQuery(
    { tweetId: tweetId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const replies = useMemo(() => data?.pages.map((page) => page.items).flat() || [], [data]);

  const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible && hasNextPage !== false) {
      fetchNextPage();
    }
  });

  return { replies, ref, isFetchingNextPage, hasNextPage };
}

/**
 * `trpc.home.tweets` for `/`
 */
export function useHomeList(enabled: boolean) {
  const { data } = trpc.home.tweets.useQuery(
    {},
    {
      enabled: enabled,
    },
  );
  const tweets = useMemo(() => data || [], [data]);

  return { tweets };
}
