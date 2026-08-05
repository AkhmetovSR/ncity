'use client';

import React from "react";
import s from "@/components/freeService/WaterBalance/WaterBalance.module.css";
import { motion } from "framer-motion";

export default function WidgetWaterBalance() {
    // Функция плавного скролла к калькулятору при клике на весь виджет
    const handleClick = () => {
        const calcElement = document.getElementById("water-calculator-section");
        if (calcElement) {
            calcElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.div
            className={s.WidgetWaterBalance}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClick}
        >
            {/* Маленькая аккуратная картинка-иконка */}
            <div className={s.widgetIcon}>
                💧
            </div>

            {/* Текстовая группа внизу виджета */}
            <div className={s.widgetTextContainer}>
                <span className={s.widgetLabel}>Расчет ИЖС</span>
                <h3 className={s.widgetTitle}>Баланс ВВ</h3>
            </div>
        </motion.div>
    );
}
