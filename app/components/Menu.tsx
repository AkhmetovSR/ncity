// app/components/Menu.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/components/Menu.module.css';

interface TabItem {
    name: string;
    path: string;
    isActive: (pathname: string) => boolean;
    icon: React.ReactNode;
}

export default function Menu() {
    const pathname = usePathname();

    const tabs: TabItem[] = [
        {
            name: 'Главная',
            path: '/',
            isActive: (path) => path === '/' || path.startsWith('/card/'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            )
        },
        {
            name: 'Vac',
            path: '/vacancy',
            isActive: (path) => path.startsWith('/vacancy'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
        {
            name: 'Профиль',
            path: '/profile',
            isActive: (path) => path.startsWith('/profile'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
        {
            name: 'О нас',
            path: '/about',
            isActive: (path) => path.startsWith('/about'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            )
        },
        {
            name: 'Контакты',
            path: '/contacts',
            isActive: (path) => path.startsWith('/contacts'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
            )
        }
    ];

    // ИСПРАВЛЕНО: Берём первый элемент массива tabs (Главная) и проверяем, там ли мы
    const isAtHomeZone = tabs[0].isActive(pathname);

    return (
        <nav className={styles.Menu}>
            <div className={styles.linksContainer}>
                {tabs.map((tab) => {
                    const active = tab.isActive(pathname);

                    // Если мы ушли с Главной, все переключения между вкладками идут через REPLACE
                    const shouldReplace = active || !isAtHomeZone;

                    return (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            className={`${styles.link} ${active ? styles.active : ''}`}
                            replace={shouldReplace}
                            prefetch={true}
                        >
                            {tab.icon}
                            <span>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
