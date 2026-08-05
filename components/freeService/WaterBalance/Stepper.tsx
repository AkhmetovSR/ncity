'use client';

import React from 'react';
import s from '@/components/freeService/WaterBalance/WaterBalance.module.css';

interface StepperProps {
    // label: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (newValue: number) => void;
}

export default function Stepper({ value, min = 1, max = 20, onChange }: StepperProps) {
    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <div className={s.stepperWrapper}>
            <label className={s.label}>Количество проживающих</label>
            <div className={s.stepperContainer}>
                {/* Кнопка Минус */}
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className={s.stepperBtn}
                    aria-label="Уменьшить"
                >
                    −
                </button>

                {/* Центральный блок с крупной цифрой */}
                <div className={s.stepperValueContainer}>
                    <span className={s.stepperValue}>{value}</span>
                </div>

                {/* Кнопка Плюс */}
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className={s.stepperBtn}
                    aria-label="Увеличить"
                >
                    +
                </button>
            </div>
        </div>
    );
}
