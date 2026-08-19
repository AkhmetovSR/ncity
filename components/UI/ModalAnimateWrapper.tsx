'use client';
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ModalAnimateWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Модалка активна только если в URL присутствует сегмент /card/
    const isModalActive = pathname.includes('/card/');

    return (
        <AnimatePresence mode="wait">
            {isModalActive ? children : null}
        </AnimatePresence>
    );
}
