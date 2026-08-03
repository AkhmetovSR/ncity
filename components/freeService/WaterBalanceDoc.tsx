'use client';

import React from 'react';
import s from './WaterBalance.module.css';
import { WaterBalanceInputs, WaterBalanceResults } from './types';
import { WATER_NORMS } from './calculator';

interface WaterBalanceDocProps {
    inputs: WaterBalanceInputs;
    results: WaterBalanceResults;
    currentDate: string;
}

export default function WaterBalanceDoc({ inputs, results, currentDate }: WaterBalanceDocProps) {
    return (
        <div className={s.documentArea}>
            {/* Шапка заявителя */}
            <div className={s.docHeader}>
                <p style={{
                    fontWeight: 'bold',
                    margin: '0 0 4px 0'
                }}>В {inputs.organization || '_____________________'}</p>
                <p style={{margin: 0}}>От: <span
                    style={{fontWeight: 'bold'}}>{inputs.fio || '_____________________'}</span></p>
                <p style={{margin: 0}}>Адрес объекта: г. Нягань, {inputs.address || '_____________________'}</p>
                <p style={{margin: 0}}>Тел: {inputs.phone || '_____________________'}</p>
            </div>

            {/* Название документа */}
            <div className={s.docTitle}>
                <h1>Баланс водопотребления и водоотведения</h1>
                <p style={{margin: '4px 0 0 0'}}>объекта индивидуального жилищного строительства (ИЖС)</p>
            </div>

            <p className={s.docText}>
                Настоящий расчет водохозяйственного баланса выполнен для обоснования заявляемых объемов водопотребления
                и водоотведения строящегося (реконструируемого) жилого дома в соответствии с требованиями СП
                30.13330.2020 «Внутренний водопровод и канализация зданий».
            </p>

            {/* Таблица расчетных данных */}
            <table className={s.table}>
                <thead>
                <tr>
                    <th style={{textAlign: 'center', width: '5%'}}>№</th>
                    <th style={{textAlign: 'left', width: '45%'}}>Наименование видов нужд</th>
                    <th style={{textAlign: 'center', width: '10%'}}>Ед. изм.</th>
                    <th style={{textAlign: 'center', width: '10%'}}>Норма</th>
                    <th style={{textAlign: 'center', width: '10%'}}>Кол-во</th>
                    <th style={{textAlign: 'center', width: '10%'}}>Водопотр.</th>
                    <th style={{textAlign: 'center', width: '10%'}}>Водоотв.</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style={{textAlign: 'center'}}>1</td>
                    <td>Хозяйственно-бытовые нужды жилого дома (проживание граждан, приготовление пищи, гигиена)</td>
                    <td style={{textAlign: 'center'}}>чел.</td>
                    <td style={{textAlign: 'center'}}>{WATER_NORMS.RESIDENT}</td>
                    <td style={{textAlign: 'center'}}>{inputs.residents}</td>
                    <td style={{textAlign: 'center', fontWeight: 'bold'}}>{results.waterPeople.toFixed(3)}</td>
                    <td style={{textAlign: 'center', fontWeight: 'bold'}}>{results.sewagePeople.toFixed(3)}</td>
                </tr>

                {inputs.gardenArea > 0 && (
                    <tr>
                        <td style={{textAlign: 'center'}}>2</td>
                        <td>Полив приусадебного участка, зеленых насаждений и газонов (сезонный май-август)</td>
                        <td style={{textAlign: 'center'}}>м²</td>
                        <td style={{textAlign: 'center'}}>{WATER_NORMS.GARDEN}</td>
                        <td style={{textAlign: 'center'}}>{inputs.gardenArea}</td>
                        <td style={{textAlign: 'center', fontWeight: 'bold'}}>{results.waterGarden.toFixed(3)}</td>
                        <td style={{textAlign: 'center', fontWeight: 'bold'}}>0.000</td>
                    </tr>
                )}

                {inputs.hasBanya && (
                    <tr>
                        <td style={{textAlign: 'center'}}>{inputs.gardenArea > 0 ? 3 : 2}</td>
                        <td>Обеспечение нужд бани / сауны на придомовой территории</td>
                        <td style={{textAlign: 'center'}}>чел.</td>

                        {/* ИСПРАВЛЕНО: Заменили BANYA на BANYA_PER_USE */}
                        <td style={{textAlign: 'center'}}>{WATER_NORMS.BANYA_PER_USE}</td>

                        <td style={{textAlign: 'center'}}>{inputs.residents}</td>
                        <td style={{textAlign: 'center', fontWeight: 'bold'}}>{results.waterBanya.toFixed(3)}</td>
                        <td style={{textAlign: 'center', fontWeight: 'bold'}}>{results.sewageBanya.toFixed(3)}</td>
                    </tr>
                )}

                {inputs.hasPool && (
                    <tr>
                        <td style={{textAlign: 'center'}}>
                            {1 + (inputs.gardenArea > 0 ? 1 : 0) + (inputs.hasBanya ? 1 : 0) + 1}
                        </td>
                        <td>Технологическое обслуживание и подпитка бассейна (V={inputs.poolVolume} м³)</td>
                        <td style={{textAlign: 'center'}}>м³</td>

                        {/* СКОРРЕКТИРОВАНО: Текст приведен в соответствие с калькулятором */}
                        <td style={{textAlign: 'center'}}>3%/сут</td>

                        <td style={{textAlign: 'center'}}>1</td>
                        <td style={{textAlign: 'center', fontWeight: 'bold'}}>{results.waterPool.toFixed(3)}</td>
                        <td style={{textAlign: 'center', fontWeight: 'bold'}}>{results.sewagePool.toFixed(3)}</td>
                    </tr>
                )}

                <tr style={{fontWeight: 'bold'}}>
                    <td colSpan={5} style={{textAlign: 'right', textTransform: 'uppercase', padding: '10px'}}>Итого
                        (м³/сут):
                    </td>
                    <td style={{textAlign: 'center', color: '#1d4ed8'}}>{results.totalWater.toFixed(3)}</td>
                    <td style={{textAlign: 'center', color: '#1d4ed8'}}>{results.totalSewage.toFixed(3)}</td>
                </tr>
                </tbody>
            </table>

            {/* Сноски правового характера */}
            <div className={s.notes}>
                <p><span style={{fontWeight: 'bold'}}>Примечание 1:</span> Расход на полив территории принят с
                    коэффициентом водоотведения 0.000 (вода полностью поглощается почвой и растениями).</p>
                {inputs.hasPool &&
                    <p><span style={{fontWeight: 'bold'}}>Примечание 2:</span> Расход на бассейн учитывает
                        среднесуточное обновление чаши для выполнения санитарных нормативов фильтрации.</p>}
                <p><span style={{fontWeight: 'bold'}}>Примечание 3:</span> Все расчетные нормативы строго соответствуют
                    СП 30.13330.</p>
            </div>

            {/* Подписи сторон */}
            <div className={s.signatures}>
                <div>
                    <p style={{margin: 0}}>Дата: {inputs.fio ? currentDate : '«____» ____________ 202___ г.'}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                    <p style={{margin: 0}}>Подпись заявителя: _____________________</p>
                    <p style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        margin: '4px 0 0 0'
                    }}>( {inputs.fio || 'Расшифровка подписи'} )</p>
                </div>
            </div>
        </div>
    );
}
