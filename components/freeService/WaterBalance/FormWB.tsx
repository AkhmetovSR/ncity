'use client';

import React from 'react';
import s from '@/components/freeService/WaterBalance/WaterBalance.module.css';
import FormInput from '@/components/freeService/WaterBalance/FormInput';
import CheckboxOptions from '@/components/freeService/WaterBalance/CheckboxOptions';
import Stepper from '@/components/freeService/WaterBalance/Stepper';
import { WaterBalanceInputs, FormErrors } from '@/components/freeService/WaterBalance/types';

interface WaterBalanceFormProps {
    inputs: WaterBalanceInputs;
    errors: FormErrors;
    handleInputChange: (key: keyof WaterBalanceInputs, value: string | number | boolean) => void;
}

export default function FormWB({ inputs, errors, handleInputChange }: WaterBalanceFormProps) {
    return (
        <div className={s.interfaceBlock}>
            <div className={s.formSection}>

                {/* Выбор организации */}
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

                {/* ФИО собственника */}
                <FormInput
                    label="ФИО собственника (полностью)"
                    value={inputs.fio}
                    onChange={(e) => handleInputChange('fio', e.target.value)}
                    error={errors.fio}
                />

                {/* Сетка: Адрес и Телефон */}
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

                {/* Сетка: Крупный Apple-степпер для жителей */}
                <div className={s.grid2}>
                    <Stepper
                        value={inputs.residents}
                        onChange={(newValue) => handleInputChange('residents', newValue)}
                    />
                </div>

                {/* Опции участка (Огород, Баня, Бассейн и их зависимые инпуты) */}
                <CheckboxOptions inputs={inputs} handleInputChange={handleInputChange} />

            </div>
        </div>
    );
}
