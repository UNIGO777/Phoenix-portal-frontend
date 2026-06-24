import { useEffect, useRef, useCallback } from 'react';

/**
 * Detects when a sentinel element (or the window bottom) is near the viewport
 * and calls `onLoadMore`. Works with both window scroll and scrollable containers.
 *
 * @param {Object}   opts
 * @param {boolean}  opts.hasMore      – Are there more pages to fetch?
 * @param {boolean}  opts.loading      – Is a fetch currently in progress?
 * @param {Function} opts.onLoadMore   – Called when the user scrolls near the bottom.
 * @param {number}   [opts.threshold=200] – Pixels from the bottom to trigger early.
 * @param {React.RefObject} [opts.scrollRef] – Optional scrollable container ref.
 * @returns {{ sentinelRef: React.RefObject }} – Attach this ref to a div at the list bottom.
 */
export default function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 200,
  scrollRef,
}) {
  const sentinelRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    if (scrollRef?.current) {
      const el = scrollRef.current;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < threshold) {
        onLoadMore();
      }
    } else {
      const scrollBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      if (scrollBottom < threshold) {
        onLoadMore();
      }
    }
  }, [loading, hasMore, onLoadMore, threshold, scrollRef]);

  useEffect(() => {
    const target = scrollRef?.current || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [handleScroll, scrollRef]);

  return { sentinelRef };
}
