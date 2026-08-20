// app/components/ModalAnimateWrapper.tsx
'use client';

import { AnimatePresence } from "framer-motion";

export default function ModalAnimateWrapper({ children }: { children: React.ReactNode }) {
    return (
        /* mode="popLayout" часто работает лучше для layoutId, но оставляем "wait", если вам так привычнее */
        <AnimatePresence mode="wait">
            {children}
        </AnimatePresence>
    );
}
