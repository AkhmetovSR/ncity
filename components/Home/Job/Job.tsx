'use client';
import s from "@/components/Home/Job/Job.module.css"
import { motion } from "framer-motion";
import React from "react";
import Lottie from 'lottie-react';
import tapAnimation from '@/public/lottie/business-analysis1.json';
import Link from 'next/link';

export default function Job() {
    return (
            <motion.div className={s.Vacancy} layoutId="vacancy" transition={{ duration: 0.3, ease: "easeOut", type: "tween" }}>
                <Link href="/vacancy" style={{ textDecoration: 'none' }}>
                <div className={s.Content}>
                    <div className={s.Left}>
                        <div className={s.Title}>Вакансии <br/>нашего города</div>
                        <div className={s.SearchJob}>смотреть вакансии</div>
                    </div>
                    <div className={s.Right}>
                        <div className={s.WorkImg}>
                            <Lottie animationData={tapAnimation} loop={true} autoplay={true}/>
                        </div>
                    </div>
                </div>
                </Link>
            </motion.div>
    );
}