'use client';
import React from "react";
import s from "@/components/Home/Home.module.css"
import Title from "@/components/Home/Title/Title";
import Job from "@/components/Home/Job/Job";
import { AnimatePresence, motion } from "framer-motion";
import DarkWhiteTheme from "@/components/DarkWhireTheme/DarkWhiteTheme";
import Content from "@/components/Home/Content/Content"; // Импортируем кнопку темы

export default function Home() {
    return (
        <AnimatePresence>
            <div className={s.Home}>
                    <div className={s.Top}>
                        <div className={s.TopContent}>
                            <Title />
                            <Job />
                        </div>
                    </div>
                    <div className={s.Services}>
                        <Content/>
                    </div>
                </div>
        </AnimatePresence>
    );
}