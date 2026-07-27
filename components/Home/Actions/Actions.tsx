// app/components/Home/Actions/Action.tsx
'use client';

import React from "react";
import s from "@/components/Home/Home.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Actions() {
    return (
        <Link href="/view/actions" prefetch={true} scroll={false}>
            <motion.div layoutId="actions" className={s.Actions}>
                <h3>Акции</h3>
            </motion.div>
        </Link>
    );
}
