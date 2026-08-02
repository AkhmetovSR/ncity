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

                {/* Главная */}
                <Link href="/" className={`${s.link} ${pathname === "/" ? s.active : ""}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span>Home</span>
                </Link>

                {/* О нас */}
                <Link href="/about" className={`${s.link} ${pathname === "/about" ? s.active : ""}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                    </svg>
                    <span>About</span>
                </Link>

                {/* Контакты */}
                <Link href="/contacts" className={`${s.link} ${pathname === "/contacts" ? s.active : ""}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>Contacts</span>
                </Link>

            </div>
        </div>
    );
}
