'use client';
import React from "react";
import s from "./Home.module.css"
import Title from "@/components/Home/Title/Title";
import Job from "@/components/Home/Job/Job";
import {motion} from "framer-motion";

export  default function Home() {

    return (
        <div className={s.Home}>
            <Title/>
            <Job/>
        </div>
    );
}