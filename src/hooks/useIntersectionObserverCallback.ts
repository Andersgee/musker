import { useCallback } from "react";

/**
 * Wrapper for `new IntersectionObserver(callback, options)`
 *
 * [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 *
 * note: this is the simplest I could make it. options are static (not part of dependency array of callback)
 *
 * ### Example
 *
 * ```ts
 * const ref = UseIntersectionObserverCallback<HTMLDivElement>(([entry]) => {
 *   if (!!entry?.isIntersecting) {
 *     //do something
 *   }
 * });
 * ```
 */
export function UseIntersectionObserverCallback<T extends Element>(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) {
  //see https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  return useCallback((node: T) => {
    if (node !== null) {
      const observer = new IntersectionObserver(callback, options);
      observer.observe(node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
