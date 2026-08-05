'use client';

import React from 'react';
import s from '@/components/freeService/WaterBalance/WaterBalance.module.css';
import { useWaterBalance } from '@/components/freeService/WaterBalance/useWaterBalance';
import FormWB from "@/components/freeService/WaterBalance/FormWB";
import PreviewWB from "@/components/freeService/WaterBalance/PreviewWB";
import WaterBalanceDoc from "@/components/freeService/WaterBalance/WaterBalanceDoc"; // Импортируем бланк для shadow-печати
import PrintStyles from "@/components/freeService/WaterBalance/PrintStyles"; // Подключаем слой печатных стилей

export default function WaterBalance() {
    const {
        inputs,
        results,
        errors,
        isPreviewOpen,
        handleInputChange,
        openPreview,
        closePreview,
        handlePrintPDF,
        handleDownloadDocx
    } = useWaterBalance();

    const currentDate = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            {/* Глобальный инжектор печатных стилей */}
            <PrintStyles />

            <div className={s.container}>
                <h2 className={s.title}>Бесплатный расчет БВВ</h2>

                {/* Отрефакторенный изолированный компонент формы */}
                <FormWB
                    inputs={inputs}
                    errors={errors}
                    handleInputChange={handleInputChange}
                />

                <div className={s.stickyBar}>
                    <button onClick={openPreview} className={s.btnSecondary}>
                        👁️ Предпросмотр
                    </button>
                    <button onClick={handlePrintPDF} className={s.btnSecondary}
                            style={{color: '#ff3b30', borderColor: '#ff3b30'}}>
                        📄 Скачать в PDF
                    </button>
                    <button onClick={handleDownloadDocx} className={s.btnPrimary}>
                        💾 Скачать в Word
                    </button>
                </div>

                <PreviewWB
                    isOpen={isPreviewOpen}
                    onClose={closePreview}
                    inputs={inputs}
                    results={results}
                    currentDate={currentDate}
                    onDownload={handleDownloadDocx}
                    onPrintPDF={handlePrintPDF} /* Пробрасываем метод печати в модалку для кнопок-близнецов */
                />
            </div>

            {/*
              ШАДОУ-СЛОЙ ДЛЯ НАВТИВНОЙ ПЕЧАТИ (Shadow Print Node)
              Он всегда находится в DOM-дереве и мгновенно обновляется при вводе данных.
              Класс s.printPortalOnly намертво скрывает его от глаз пользователя на экране,
              но когда в хуке срабатывает синхронный window.print(), принтер видит только его!
            */}
            <div id="print-portal-root" className={s.printPortalOnly}>
                <WaterBalanceDoc
                    inputs={inputs}
                    results={results}
                    currentDate={currentDate}
                />
            </div>
        </>
    );
}
