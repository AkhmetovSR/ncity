'use client';
import React from "react";
import s from "./Home.module.css"
import Title from "@/components/Home/Title/Title";
import Job from "@/components/Home/Job/Job";
import { AnimatePresence, motion } from "framer-motion";
import DarkWhiteTheme from "@/components/DarkWhireTheme/DarkWhiteTheme"; // Импортируем кнопку темы

export default function Home() {
    return (
        <AnimatePresence>
            <div className={s.Home}>
                {/* Кнопка переключения темы в правом верхнем углу */}
                <div className={s.themeButtonWrapper}>
                    <DarkWhiteTheme />
                </div>
                <Title />
                <Job />
            </div>
        </AnimatePresence>
    );
}