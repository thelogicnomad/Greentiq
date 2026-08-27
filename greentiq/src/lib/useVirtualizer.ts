import { useState, useEffect, useCallback } from "react";

export interface VirtualItem {
  index: number;
  start: number;
  size: number;
  key: number;
}

export interface UseVirtualizerOptions {
  count: number;
  getScrollElement: () => HTMLElement | null;
  estimateSize: (index: number) => number;
  overscan?: number;
}

export function useVirtualizer({
  count,
  getScrollElement,
  estimateSize,
  overscan = 5,
}: UseVirtualizerOptions) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  const handleScroll = useCallback(() => {
    const el = getScrollElement();
    if (el) {
      setScrollTop(el.scrollTop);
      setContainerHeight(el.clientHeight || 600);
    }
  }, [getScrollElement]);

  useEffect(() => {
    const el = getScrollElement();
    if (!el) return;

    setContainerHeight(el.clientHeight || 600);
    setScrollTop(el.scrollTop);

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [getScrollElement, handleScroll]);

  const defaultSize = estimateSize(0) || 160;

  const getTotalSize = useCallback(() => {
    return count * defaultSize;
  }, [count, defaultSize]);

  const getVirtualItems = useCallback((): VirtualItem[] => {
    if (count === 0) return [];

    const startIndex = Math.max(0, Math.floor(scrollTop / defaultSize) - overscan);
    const visibleCount = Math.ceil(containerHeight / defaultSize);
    const endIndex = Math.min(count - 1, startIndex + visibleCount + overscan * 2);

    const items: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * defaultSize,
        size: defaultSize,
        key: i,
      });
    }

    return items;
  }, [count, scrollTop, defaultSize, containerHeight, overscan]);

  return {
    getTotalSize,
    getVirtualItems,
  };
}
