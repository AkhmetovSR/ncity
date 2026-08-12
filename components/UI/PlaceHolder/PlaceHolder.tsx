'use client';

import React from 'react';
import s from '@/components/UI/PlaceHolder/PlaceHolder.module.css';

export default function PlaceHolder() {
    return (
        <div className={s.lockOverlay}>
            <div className={s.iconWrapper}><div className={s.icon}>🔄</div></div>
            <div className={s.title}>Пожалуйста, верните устройство в книжную ориентацию</div>
        </div>
    );
}
