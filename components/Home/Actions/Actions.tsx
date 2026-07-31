// app/components/Home/Actions/Action.tsx
'use client';

import React from "react";
import s from "@/components/Home/Home.module.css";
import { motion } from "framer-motion";

export default function Actions() {
    return (
            <motion.div className={s.Actions}>
                <h3>Акции</h3>
            </motion.div>
    );
}
