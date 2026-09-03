// app/vacancy/_hooks/useInfiniteScroll.ts - заберет на себя всю грязную работу со слушателем пересечений
import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
}

/**
 * Универсальный сеньор-хук для бесконечного скролла на базе IntersectionObserver
 */
export function useInfiniteScroll({ loading, hasMore, loadMore }: UseInfiniteScrollProps) {
    const triggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (loading || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                const [entry] = entries;
                if (entry?.isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px', threshold: 0.1 }
        );

        if (triggerRef.current) observer.observe(triggerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore, loadMore]);

    return triggerRef;
}
