'use client';
import j from "@/components/Home/Job/Job.module.css"
import { motion } from "framer-motion";
import React from "react";
import Lottie from 'lottie-react';
import tapAnimation from '@/public/lottie/business-analysis.json';
import Link from 'next/link';

export default function Job() {
    return (

            <motion.div className={j.Carousel} layoutId="vacancy" transition={{ duration: 0.3, ease: "easeOut", type: "tween" }}>
                <Link href="/vacancy" style={{ textDecoration: 'none' }}>
                <div className={j.Content}>
                    <div className={j.Left}>
                        <div className={j.Title}>Вакансии <br/>нашего города</div>
                        <div className={j.SearchJob}>смотреть вакансии</div>
                    </div>
                    <div className={j.Right}>
                        <div className={j.WorkImg}>
                            {/*<Lottie animationData={tapAnimation} loop={true} autoplay={true}/>*/}
                        </div>
                    </div>
                </div>
                </Link>
            </motion.div>

    );
}