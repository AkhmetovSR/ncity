'use client';

import React from 'react';
import s from '@/components/freeService/WaterBalance/WaterBalance.module.css';
import WaterBalanceDoc from "@/components/freeService/WaterBalance/WaterBalanceDoc";
import { WaterBalanceInputs, WaterBalanceResults } from "@/components/freeService/WaterBalance/types";

interface PreviewWBProps {
    isOpen: boolean;
    onClose: () => void;
    inputs: WaterBalanceInputs;
    results: WaterBalanceResults;
    currentDate: string;
    onDownload: () => void; // Метод для Word (.doc) из useWaterBalance
    onPrintPDF: () => void; // Метод для PDF (window.print) из useWaterBalance
}

export default function PreviewWB({
                                      isOpen,
                                      onClose,
                                      inputs,
                                      results,
                                      currentDate,
                                      onDownload,
                                      onPrintPDF
                                  }: PreviewWBProps) {
    // Если модалка закрыта — возвращаем null, чтобы экономить память устройства
    if (!isOpen) return null;

    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Кнопка-крестик в верхнем углу */}
                <button className={s.closeModalBtn} onClick={onClose} aria-label="Закрыть">
                    ✕
                </button>

                {/* Визуальный интерактивный бланк документа на экране */}
                <WaterBalanceDoc
                    inputs={inputs}
                    results={results}
                    currentDate={currentDate}
                />

                {/* ЭЛЕГАНТНАЯ ПАНЕЛЬ ДЕЙСТВИЙ: Кнопки-близнецы без эмодзи, с тонкими SVG */}
                <div className={s.modalActions}>
                    <button onClick={onClose} className={`${s.modalBtn} ${s.btnCancel}`}>
                        Назад
                    </button>

                    {/* Кнопка Сохранить в PDF */}
                    <button onClick={onPrintPDF} className={`${s.modalBtn} ${s.btnPrint}`}>
                        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Сохранить в PDF
                    </button>

                    {/* Кнопка Скачать в Word */}
                    <button onClick={onDownload} className={`${s.modalBtn} ${s.btnSubmit}`}>
                        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Скачать в Word
                    </button>
                </div>
            </div>
        </div>
    );
}
