// // app/components/SpecialPromoCard.tsx
// 'use client';
//
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import StoreCard from '@/components/StoreCard';
// import Job from "@/components/Home/Job/Job";
// import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
// import s from '@/app/page.module.css';
//
// interface SpecialPromoCardProps {
//     activeId: string | null;
//     setActiveId: (id: string | null) => void;
//     activeVacancyId: string | null; // Изменено
//     setActiveVacancyId: (id: string | null) => void; // Изменено
// }
//
// export function SpecialPromoCard({
//                                      activeId,
//                                      setActiveId,
//                                      activeVacancyId,
//                                      setActiveVacancyId
//                                  }: SpecialPromoCardProps) {
//     const id = "vacancy";
//     const isOpen = activeId === id;
//
//     return (
//         <div className={s.VacancyCard}>
//             <Link
//                 href={`/card/${id}`}
//                 className={s.cardLink}
//                 onClick={(e) => {
//                     if (e.metaKey || e.ctrlKey || e.button === 1) return;
//                     e.preventDefault();
//                     setActiveId(id);
//                 }}
//             >
//                 {/* 🌟 Чтобы Framer Motion не сходил с ума, анимируем фон только когда карточка закрыта, либо убираем дубликат layoutId */}
//                 <motion.div layoutId={`card-bg-${id}`} className={s.cardBase}>
//                     {!isOpen && <Job />}
//                 </motion.div>
//             </Link>
//
//             <StoreCard id={id} activeId={activeId} setActiveId={setActiveId}>
//                 {/* Передаем стейты управления внутрь списка */}
//                 <VacancyList
//                     activeVacancyId={activeVacancyId}
//                     setActiveVacancyId={setActiveVacancyId}
//                 />
//             </StoreCard>
//         </div>
//     );
// }

// app/components/SpecialPromoCard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Job from "@/components/Home/Job/Job";
import s from '@/components/SpecialPromoCard.module.css';

/**
 * Специальная промо-карточка ("vacancy")
 * Работает напрямую от адресной строки браузера без пропсов и локального стейта видимости.
 */
export function SpecialPromoCard() {
    const id = "vacancy";
    const pathname = usePathname();

    // 🌟 СЕНЬОР-ФИКС ГИДРАТАЦИИ: Флаг, указывающий, что компонент успешно смонтировался на клиенте.
    // На сервере (SSR) он всегда равен false. Это предотвращает расхождения HTML между сервером и клиентом.
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Проверяем статус напрямую по URL. Если путь совпадает — карточка считается открытой.
    const isOpen = pathname.startsWith(`/card/${id}`);

    return (
        <div className={s.VacancyCard}>
            <Link
                href={`/card/${id}`}
                className={s.cardLink}
                scroll={false} // КРИТИЧНО ДЛЯ PWA: Запрещаем прыгать по скроллу вверх при клике
            >
                <motion.div layoutId={`card-bg-${id}`} className={s.cardBase}>
                    {/*
                      🌟 СЕНЬОР-ФИКС: Управляем видимостью виджета на основе гидратации.
                      1. До маунта (на сервере и при первой отрисовке) всегда рендерим <Job />,
                         чтобы поисковые роботы (SEO) и первый кадр рендеринга видели валидный HTML.
                      2. После маунта (isMounted === true) скрываем виджет только если роут совпадает (isOpen === true).
                      3. Перенесли условное скрытие на CSS-класс (s.widgetHidden), чтобы DOM-структура
                         (количество тегов и их порядок) оставалась неизменной. Это гарантирует 100% стабильность гидратации Next.js
                         и бесконфликтную работу анимаций `layoutId` во Framer Motion.
                    */}
                    <div className={(isMounted && isOpen) ? s.widgetHidden : s.widgetVisible}>
                        <Job />
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
