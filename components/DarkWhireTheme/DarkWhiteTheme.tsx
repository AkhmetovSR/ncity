'use client';
import React, { useEffect, useState } from 'react';
import s from '@/components/DarkWhireTheme/DarkWhiteTheme.module.css';

export default function DarkWhiteTheme() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Загрузка темы из localStorage при монтировании
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    // Переключение темы
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button onClick={toggleTheme} className={s.themeToggle}>
            <span className={s.themeIcon}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className={s.themeText}>{theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>
        </button>
    );
}