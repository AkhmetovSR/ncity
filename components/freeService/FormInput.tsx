'use client';

import React from 'react';
import s from './WaterBalance.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
    return (
        <div className={s.inputContainer}>
            <input
                {...props}
                placeholder=" "
                className={`${s.input} ${error ? s.inputError : ''}`}
            />
            <label className={s.floatingLabel}>{label}</label>
            {error && <span className={s.errorText}>{error}</span>}
        </div>
    );
}
