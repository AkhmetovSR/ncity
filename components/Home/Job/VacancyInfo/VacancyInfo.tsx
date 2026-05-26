'use client';
import s from './VacancyInfo.module.css';
import { useState, useRef, useEffect } from "react";
import { Vacancy } from "@/types/vacancy";
import VacancyHeader from "@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader";
import VacancyContent from "@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent";

interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
}

export default function VacancyInfo({ vacancy, onClose }: VacancyInfoProps) {
    const [canDrag, setCanDrag] = useState(true);
    const panelRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const currentY = useRef(0);

    const closeWithAnimation = () => {
        if (panelRef.current) {
            panelRef.current.style.transition = 'transform 0.2s ease-out';
            panelRef.current.style.transform = 'translateY(100%)';
            setTimeout(() => {
                onClose?.();
            }, 100);
        } else {
            onClose?.();
        }
    };

    const resetPosition = () => {
        if (panelRef.current) {
            panelRef.current.style.transition = 'transform 0.3s ease-out';
            panelRef.current.style.transform = '';
            currentY.current = 0;
        }
    };

    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const onTouchStart = (e: TouchEvent) => {
            if (!canDrag) return;
            startY.current = e.touches[0].clientY;
            panel.style.transition = 'none';
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!canDrag) return;
            const delta = e.touches[0].clientY - startY.current;
            if (delta > 0) {
                currentY.current = delta;
                panel.style.transform = `translateY(${delta}px)`;
                e.preventDefault();
            }
        };

        const onTouchEnd = () => {
            if (!canDrag) return;

            panel.style.transition = 'transform 0.2s ease-out';

            if (currentY.current > 150) {
                panel.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    onClose?.();
                }, 100);
            } else {
                panel.style.transform = '';
                currentY.current = 0;
            }
        };

        panel.addEventListener('touchstart', onTouchStart, { passive: false });
        panel.addEventListener('touchmove', onTouchMove, { passive: false });
        panel.addEventListener('touchend', onTouchEnd);

        return () => {
            panel.removeEventListener('touchstart', onTouchStart);
            panel.removeEventListener('touchmove', onTouchMove);
            panel.removeEventListener('touchend', onTouchEnd);
        };
    }, [canDrag, onClose]);

    if (!vacancy) return null;

    return (
        <>
            <div className={s.overlay} onClick={closeWithAnimation} ref={panelRef}/>
            <div ref={panelRef} className={s.vacancyInfo}>
                <VacancyHeader vacancy={vacancy} onClose={closeWithAnimation} />
                <VacancyContent
                    vacancy={vacancy}
                    onClose={closeWithAnimation}
                    onScrollTopChange={setCanDrag}
                />
            </div>
        </>
    );
}