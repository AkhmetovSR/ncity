// app/vacancy/_hooks/useScrollTop.ts
import { useEffect, useRef } from "react";

/**
 * Кастомный хук для отслеживания того, находится ли скролл элемента на самом верху.
 * Используется для синхронизации нативного скролла с drag-жестами шторки.
 */
export function useScrollTop(onScrollTopChange?: (isAtTop: boolean) => void) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleScroll = () => {
            // Порог в 5px для стабильного захвата жеста на мобильных
            const atTop = element.scrollTop <= 5;
            onScrollTopChange?.(atTop);
        };

        // Инициализируем проверку при маунте
        handleScroll();
        element.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, [onScrollTopChange]);

    return elementRef;
}
