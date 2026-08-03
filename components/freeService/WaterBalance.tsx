'use client';

import React from 'react';
import s from './WaterBalance.module.css';
import { useWaterBalance } from './useWaterBalance';
import WaterBalanceDoc from './WaterBalanceDoc';
import FormInput from './FormInput';
import CheckboxOptions from './CheckboxOptions';

export default function WaterBalance() {
    const {
        inputs,
        results,
        errors,
        isPreviewOpen,
        handleInputChange,
        openPreview,
        closePreview,
        handleDownloadDocx
    } = useWaterBalance();

    const currentDate = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className={s.container}>
            <h2 className={s.title}>Бесплатный расчет БВВ</h2>

            <div className={s.interfaceBlock}>
                <div className={s.formSection}>
                    <FormInput
                        label="Организация (куда подается баланс)"
                        value={inputs.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        error={errors.organization}
                        list="org-list"
                    />
                    <datalist id="org-list">
                        <option value="МКП г. Нягани &quot;НРК&quot;" />
                        <option value="АО &quot;ЮТЭК-Нягань&quot;" />
                    </datalist>

                    <FormInput
                        label="ФИО собственника (полностью)"
                        value={inputs.fio}
                        onChange={(e) => handleInputChange('fio', e.target.value)}
                        error={errors.fio}
                    />

                    <div className={s.grid2}>
                        <FormInput
                            label="Адрес дома в г. Нягань"
                            value={inputs.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            error={errors.address}
                        />
                        <FormInput
                            label="Контактный телефон"
                            value={inputs.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            error={errors.phone}
                        />
                    </div>

                    <CheckboxOptions inputs={inputs} handleInputChange={handleInputChange} />
                </div>
            </div>

            <div className={s.stickyBar}>
                <button onClick={openPreview} className={s.btnSecondary}>👁️ Предпросмотр бланка</button>
                <button onClick={handleDownloadDocx} className={s.btnPrimary}>💾 Скачать БВВ в Word</button>
            </div>

            {isPreviewOpen && (
                <div className={s.modalOverlay} onClick={closePreview}>
                    <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={s.closeModalBtn} onClick={closePreview}>✕</button>
                        <WaterBalanceDoc inputs={inputs} results={results} currentDate={currentDate} />

                        <div className={s.modalActions}>
                            <button onClick={closePreview} className={`${s.modalBtn} ${s.btnCancel}`}>
                                Назад
                            </button>
                            <button onClick={handleDownloadDocx} className={`${s.modalBtn} ${s.btnSubmit}`}>
                                <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" style={{ width: '1.15rem', height: '1.15rem' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Скачать документ (.doc)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
