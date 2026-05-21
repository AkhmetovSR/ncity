'use client';
import s from "@/components/Home/Job/Job.module.css"
import { motion } from "framer-motion";
import React from "react";
import Lottie from 'lottie-react';
import tapAnimation from '@/public/lottie/business-analysis1.json';
import Link from 'next/link';

export default function Job() {
    return (
            <motion.div className={s.Vacancy} layoutId="vacancy" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.2}} exit={{opacity: 0}}>

                <motion.div className={s.Content} initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
                    <Link href="/vacancy" style={{ textDecoration: 'none' }} className={s.Link}>
                    <div className={s.Left}>
                        <div className={s.Title}>Вакансии <br/>нашего города</div>
                        <div className={s.SearchJob}>смотреть вакансии</div>
                    </div>
                    <div className={s.Right}>
                        <div className={s.WorkImg}>
                            <Lottie animationData={tapAnimation} loop={true} autoplay={true}/>
                        </div>
                    </div>
                    </Link>
                </motion.div>

            </motion.div>
    );
}