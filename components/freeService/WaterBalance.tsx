'use client';

import React, { useState } from 'react';
import s from '@/components/freeService/WaterBalance.module.css';

export default function WaterBalance() {
    const [fio, setFio] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [residents, setResidents] = useState(3);
    const [gardenArea, setGardenArea] = useState(0);

    const [hasBanya, setHasBanya] = useState(false);
    const [hasPool, setHasPool] = useState(false);
    const [poolVolume, setPoolVolume] = useState(10);

    const NORM_RESIDENT = 250;
    const NORM_GARDEN = 5;
    const NORM_BANYA = 100;

    const waterPeople = Number(((residents * NORM_RESIDENT) / 1000).toFixed(3));
    const sewagePeople = waterPeople;

    const waterGarden = Number(((gardenArea * NORM_GARDEN) / 1000).toFixed(3));
    const sewageGarden = 0;

    const waterBanya = hasBanya ? Number(((residents * NORM_BANYA) / 1000).toFixed(3)) : 0;
    const sewageBanya = waterBanya;

    const waterPool = hasPool ? Number((poolVolume * 0.1).toFixed(3)) : 0;
    const sewagePool = waterPool;

    const totalWater = Number((waterPeople + waterGarden + waterBanya + waterPool).toFixed(3));
    const totalSewage = Number((sewagePeople + sewageBanya + sewagePool).toFixed(3));

    const handlePrint = () => {
        if (!fio || !address) {
            alert('Пожалуйста, заполните ФИО и адрес дома перед сохранением документа.');
            return;
        }
        window.print();
    };

    const currentDate = new Date().toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className={s.container}>

            {/* ИНТЕРФЕЙС */}
            <div className={s.interfaceBlock}>
                <h2 className={s.title}>Бесплатный расчет БВВ для жителей Нягани</h2>
                <p className={s.subtitle}>Введите данные. Документ А4 сформируется внизу автоматически.</p>

                <div className={s.formSection}>
                    <div className={s.inputGroup}>
                        <label className={s.label}>ФИО собственника (полностью)</label>
                        <input type="text" placeholder="Иванов Иван Иванович" value={fio} onChange={(e) => setFio(e.target.value)} className={s.input} />
                    </div>

                    <div className={s.grid2}>
                        <div className={s.inputGroup}>
                            <label className={s.label}>Адрес дома в г. Нягань</label>
                            <input type="text" placeholder="ул. Сибирская, д. 45" value={address} onChange={(e) => setAddress(e.target.value)} className={s.input} />
                        </div>
                        <div className={s.inputGroup}>
                            <label className={s.label}>Контактный телефон</label>
                            <input type="text" placeholder="+7 (9XX) XXX-XX-XX" value={phone} onChange={(e) => setPhone(e.target.value)} className={s.input} />
                        </div>
                    </div>

                    <div className={s.grid2}>
                        <div className={s.inputGroup}>
                            <label className={s.label}>Количество проживающих граждан</label>
                            <input type="number" min="1" value={residents} onChange={(e) => setResidents(Math.max(1, parseInt(e.target.value) || 1))} className={s.input} />
                        </div>
                        <div className={s.inputGroup}>
                            <label className={s.label}>Площадь полива участка <span className={s.hint}>(кв.м)</span></label>
                            <input type="number" min="0" value={gardenArea} onChange={(e) => setGardenArea(Math.max(0, parseInt(e.target.value) || 0))} className={s.input} />
                        </div>
                    </div>

                    <div className={s.checkboxSection}>
                        <label className={s.checkboxLabel}>
                            <input type="checkbox" checked={hasBanya} onChange={(e) => setHasBanya(e.target.checked)} className={s.checkbox} />
                            <div><strong>Наличие бани / сауны</strong></div>
                        </label>
                        <label className={s.checkboxLabel}>
                            <input type="checkbox" checked={hasPool} onChange={(e) => setHasPool(e.target.checked)} className={s.checkbox} />
                            <div><strong>Наличие бассейна</strong></div>
                        </label>
                        {hasPool && (
                            <div className={s.inputGroup} style={{ paddingLeft: '26px', marginTop: '10px' }}>
                                <label className={s.label}>Объем бассейна (куб. м):</label>
                                <input type="number" min="1" value={poolVolume} onChange={(e) => setPoolVolume(Math.max(1, parseInt(e.target.value) || 1))} className={s.input} style={{ maxWidth: '120px' }} />
                            </div>
                        )}
                    </div>

                    <button onClick={handlePrint} className={s.printButton}>🖨️ Сохранить готовый БВВ в PDF</button>
                </div>
            </div>

            {/* ПЕЧАТНЫЙ БЛАНК */}
            <div className={s.documentArea}>
                <div className={s.docHeader}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>В МКП г. Нягани «НРК»</p>
                    <p style={{ margin: 0 }}>От: <span style={{ fontWeight: 'bold' }}>{fio || '_____________________'}</span></p>
                    <p style={{ margin: 0 }}>Адрес объекта: г. Нягань, {address || '_____________________'}</p>
                    <p style={{ margin: 0 }}>Тел: {phone || '_____________________'}</p>
                </div>

                <div className={s.docTitle}>
                    <h1>Баланс водопотребления и водоотведения</h1>
                    <p style={{ margin: '4px 0 0 0' }}>объекта индивидуального жилищного строительства (ИЖС)</p>
                </div>

                <p className={s.docText}>
                    Настоящий расчет водохозяйственного баланса выполнен для обоснования заявляемых объемов водопотребления и водоотведения строящегося (реконструируемого) жилого дома в соответствии с требованиями СП 30.13330.2020 «Внутренний водопровод и канализация зданий».
                </p>

                <table className={s.table}>
                    <thead>
                    <tr>
                        <th style={{ textAlign: 'center', width: '5%' }}>№</th>
                        <th style={{ textAlign: 'left', width: '45%' }}>Наименование видов нужд</th>
                        <th style={{ textAlign: 'center', width: '10%' }}>Ед. изм.</th>
                        <th style={{ textAlign: 'center', width: '10%' }}>Норма</th>
                        <th style={{ textAlign: 'center', width: '10%' }}>Кол-во</th>
                        <th style={{ textAlign: 'center', width: '10%' }}>Водопотр.</th>
                        <th style={{ textAlign: 'center', width: '10%' }}>Водоотв.</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={{ textAlign: 'center' }}>1</td>
                        <td>Хозяйственно-бытовые нужды жилого дома (проживание граждан, приготовление пищи, гигиена)</td>
                        <td style={{ textAlign: 'center' }}>чел.</td>
                        <td style={{ textAlign: 'center' }}>{NORM_RESIDENT}</td>
                        <td style={{ textAlign: 'center' }}>{residents}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{waterPeople.toFixed(3)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{sewagePeople.toFixed(3)}</td>
                    </tr>

                    {gardenArea > 0 && (
                        <tr>
                            <td style={{ textAlign: 'center' }}>2</td>
                            <td>Полив приусадебного участка, зеленых насаждений и газонов (сезонный май-август)</td>
                            <td style={{ textAlign: 'center' }}>м²</td>
                            <td style={{ textAlign: 'center' }}>{NORM_GARDEN}</td>
                            <td style={{ textAlign: 'center' }}>{gardenArea}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{waterGarden.toFixed(3)}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>0.000</td>
                        </tr>
                    )}

                    {hasBanya && (
                        <tr>
                            <td style={{ textAlign: 'center' }}>{gardenArea > 0 ? 3 : 2}</td>
                            <td>Обеспечение нужд бани / сауны на придомовой территории</td>
                            <td style={{ textAlign: 'center' }}>чел.</td>
                            <td style={{ textAlign: 'center' }}>{NORM_BANYA}</td>
                            <td style={{ textAlign: 'center' }}>{residents}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{waterBanya.toFixed(3)}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{sewageBanya.toFixed(3)}</td>
                        </tr>
                    )}

                    {hasPool && (
                        <tr>
                            <td style={{ textAlign: 'center' }}>{1 + (gardenArea > 0 ? 1 : 0) + (hasBanya ? 1 : 0) + 1}</td>
                            <td>Технологическое обслуживание и подпитка бассейна (V={poolVolume} м³)</td>
                            <td style={{ textAlign: 'center' }}>м³</td>
                            <td style={{ textAlign: 'center' }}>10%/сут</td>
                            <td style={{ textAlign: 'center' }}>1</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{waterPool.toFixed(3)}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{sewagePool.toFixed(3)}</td>
                        </tr>
                    )}

                    <tr style={{ fontWeight: 'bold' }}>
                        <td colSpan={5} style={{ textAlign: 'right', textTransform: 'uppercase', padding: '10px' }}>Итого (м³/сут):</td>
                        <td style={{ textAlign: 'center', color: '#1d4ed8' }}>{totalWater.toFixed(3)}</td>
                        <td style={{ textAlign: 'center', color: '#1d4ed8' }}>{totalSewage.toFixed(3)}</td>
                    </tr>
                    </tbody>
                </table>

                <div className={s.notes}>
                    <p><span style={{ fontWeight: 'bold' }}>Примечание 1:</span> Расход на полив территории принят с коэффициентом водоотведения 0.000 (вода полностью поглощается почвой).</p>
                    {hasPool && <p><span style={{ fontWeight: 'bold' }}>Примечание 2:</span> Расход на бассейн учитывает среднесуточное обновление чаши.</p>}
                    <p><span style={{ fontWeight: 'bold' }}>Примечание 3:</span> Все расчетные нормативы соответствуют СП 30.13330.</p>
                </div>

                <div className={s.signatures}>
                    <div>
                        <p style={{ margin: 0 }}>Дата: {fio ? currentDate : '«____» ____________ 202___ г.'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0 }}>Подпись заявителя: _____________________</p>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0 0' }}>( {fio || 'Расшифровка подписи'} )</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

