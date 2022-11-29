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
 * `trpc.explore.tweets` for `/`
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
