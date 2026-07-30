'use client';

import React from "react";
import Lottie from 'lottie-react';
import tapAnimation from '@/public/lottie/business-analysis1.json';
import s from "@/components/Home/Job/Job.module.css";

export default function Job() {
    return (
        <div className={s.Content}>
            <div className={s.Left}>
                <div className={s.Title}>Вакансии</div>
                <div className={s.SearchJob}>смотреть вакансии</div>
            </div>
            <div className={s.Right}>
                <div className={s.WorkImg}>
                    <Lottie animationData={tapAnimation} loop={true} autoplay={true}/>
                </div>
            </div>
        </div>
    );
}
