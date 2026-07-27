'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from '@/components/Menu/Menu.module.css';

export default function Menu() {
    const pathname = usePathname();

    return (
        <div className={s.Menu}>
            <div className={s.linksContainer}>
                {/*
                  Убрали handleHomeClick, startTransition и router.refresh().
                  Используем чистые стандартные компоненты Link.
                  Next.js теперь мягко и безбагово переведет пользователя на /about или /contacts.
                */}
                <Link href="/" className={pathname === "/" ? s.active : ""}>Home</Link>
                <Link href="/about" className={pathname === "/about" ? s.active : ""}>About</Link>
                <Link href="/contacts" className={pathname === "/contacts" ? s.active : ""}>Contacts</Link>
            </div>
        </div>
    );
}
