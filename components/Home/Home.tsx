import type { Metadata } from "next";
import React from "react";
import s from "@/components/Home/Home.module.css";
import Job from "@/components/Home/Job/Job";
import Actions from "@/components/Home/WidgetWaterBalance/WidgetWaterBalance";
import AI from "@/components/Home/AI/AI";
import Water from "@/components/Home/Water/Water";
import Wed from "@/components/Home/Wed/Wed";
import Title from "@/components/Home/Title/Title";
import {AnimatePresence} from "framer-motion";

export const metadata: Metadata = {
    title: "Главная",
    description: "Актуальные вакансии и информационный портал города Нягань.",
};

const vidgets = [Actions, AI, Water, Wed];

export default function HomePage() {
    return (
        <div className={s.Home}>
            <AnimatePresence>
                {/*<Title/>*/}
                <Job/>
                <div className={s.Vidgets}>
                    {vidgets.map((Component, index) => (
                        <Component key={index} />
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
}