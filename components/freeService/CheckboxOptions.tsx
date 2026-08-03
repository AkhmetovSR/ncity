'use client';

import React from 'react';
import s from './WaterBalance.module.css';
import { WaterBalanceInputs } from './types';

interface CheckboxOptionsProps {
    inputs: WaterBalanceInputs;
    handleInputChange: (key: keyof WaterBalanceInputs, value: string | number | boolean) => void;
}

export default function CheckboxOptions({ inputs, handleInputChange }: CheckboxOptionsProps) {
    return (
        <div className={s.checkboxSection}>
      <span className={s.label} style={{ display: 'block', marginBottom: '12px' }}>
        Дополнительные опции на участке:
      </span>

            {/* Полив */}
            <label className={s.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={inputs.gardenArea > 0}
                    onChange={(e) => handleInputChange('gardenArea', e.target.checked ? 50 : 0)}
                    className={s.checkbox}
                />
                <div>
                    <strong>Есть огород / газон (нужен полив)</strong>
                    <p className={s.hint}>Включает сезонный расход воды на полив территории (май-август)</p>
                </div>
            </label>

            {inputs.gardenArea > 0 && (
                <div className={s.inputGroup} style={{ paddingLeft: '30px', marginTop: '10px', marginBottom: '14px' }}>
                    <label className={s.label}>Укажите примерную площадь посадок (кв. м):</label>
                    <input
                        type="number"
                        min="1"
                        value={inputs.gardenArea}
                        onChange={(e) => handleInputChange('gardenArea', Math.max(0, parseInt(e.target.value) || 0))}
                        className={s.input}
                        style={{ maxWidth: '120px', paddingTop: '12px', paddingBottom: '12px' }}
                    />
                </div>
            )}

            {/* Баня */}
            <label className={s.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={inputs.hasBanya}
                    onChange={(e) => handleInputChange('hasBanya', e.target.checked)}
                    className={s.checkbox}
                />
                <div><strong>Наличие бани / сауны</strong></div>
            </label>

            {/* Бассейн */}
            <label className={s.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={inputs.hasPool}
                    onChange={(e) => handleInputChange('hasPool', e.target.checked)}
                    className={s.checkbox}
                />
                <div><strong>Наличие бассейна</strong></div>
            </label>

            {inputs.hasPool && (
                <div className={s.inputGroup} style={{ paddingLeft: '30px', marginTop: '10px' }}>
                    <label className={s.label}>Объем бассейна (куб. м):</label>
                    <input
                        type="number"
                        min="1"
                        value={inputs.poolVolume}
                        onChange={(e) => handleInputChange('poolVolume', Math.max(1, parseInt(e.target.value) || 1))}
                        className={s.input}
                        style={{ maxWidth: '120px', paddingTop: '12px', paddingBottom: '12px' }}
                    />
                </div>
            )}
        </div>
    );
}
