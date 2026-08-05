import { WaterBalanceInputs, WaterBalanceResults } from "./types";

export const WATER_NORMS = {
    RESIDENT: 210,         // Норматив СП 30.13330 для ИЖС
    GARDEN: 5,             // Норма полива л/м²
    BANYA_PER_USE: 100,    // Литров на человека за 1 посещение бани
    BANYA_WEEKLY_FREQ: 1,  // Коэффициент частоты использования бани (1 раз в неделю)
    POOL_REFRESH_RATE: 0.03 // Подпитка бассейна 3% в сутки
} as const;

/**
 * Выполняет расчет водохозяйственного баланса ИЖС согласно СП 30.13330
 */
export function calculateWaterBalance(inputs: WaterBalanceInputs): WaterBalanceResults {
    const { residents, gardenArea, hasBanya, hasPool, poolVolume } = inputs;

    // 1. Жители (Хозяйственно-бытовые нужды)
    const waterPeople = Number(((residents * WATER_NORMS.RESIDENT) / 1000).toFixed(3));
    const sewagePeople = waterPeople;

    // 2. Полив огорода (Водоотведение отсутствует)
    const waterGarden = Number(((gardenArea * WATER_NORMS.GARDEN) / 1000).toFixed(3));
    const sewageGarden = 0;

    // 3. Баня (С учетом периодичности использования)
    const banyaDailyNorm = WATER_NORMS.BANYA_PER_USE * (WATER_NORMS.BANYA_WEEKLY_FREQ / 7);
    const waterBanya = hasBanya ? Number(((residents * banyaDailyNorm) / 1000).toFixed(3)) : 0;
    const sewageBanya = waterBanya;

    // 4. Бассейн
    const waterPool = hasPool ? Number((poolVolume * WATER_NORMS.POOL_REFRESH_RATE).toFixed(3)) : 0;
    const sewagePool = waterPool;

    // Итоги баланса
    const totalWater = Number((waterPeople + waterGarden + waterBanya + waterPool).toFixed(3));
    const totalSewage = Number((sewagePeople + sewageGarden + sewageBanya + sewagePool).toFixed(3));

    return {
        waterPeople, sewagePeople,
        waterGarden, sewageGarden,
        waterBanya, sewageBanya,
        waterPool, sewagePool,
        totalWater, totalSewage
    };
}

/**
 * Генерирует HTML/XML шаблон для экспорта в Microsoft Word (.doc)
 */
export function generateDocxTemplate(
    inputs: WaterBalanceInputs,
    results: WaterBalanceResults,
    currentDate: string
): string {
    const gardenRow = inputs.gardenArea > 0 ? `
    <tr>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">2</td>
      <td style="border:1px solid #000000; padding:6px;">Полив приусадебного участка, зеленых насаждений и газонов (сезонный май-август)</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">м²</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">5</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">${inputs.gardenArea}</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center; font-weight:bold;">${results.waterGarden.toFixed(3)}</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center; font-weight:bold;">0.000</td>
    </tr>` : '';

    const banyaRowNo = inputs.gardenArea > 0 ? 3 : 2;
    const banyaRow = inputs.hasBanya ? `
    <tr>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">${banyaRowNo}</td>
      <td style="border:1px solid #000000; padding:6px;">Обеспечение нужд бани / сауны на придомовой территории</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">чел.</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">100</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">${inputs.residents}</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center; font-weight:bold;">${results.waterBanya.toFixed(3)}</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center; font-weight:bold;">${results.sewageBanya.toFixed(3)}</td>
    </tr>` : '';

    const poolRowNo = 1 + (inputs.gardenArea > 0 ? 1 : 0) + (inputs.hasBanya ? 1 : 0) + 1;
    const poolRow = inputs.hasPool ? `
    <tr>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">${poolRowNo}</td>
      <td style="border:1px solid #000000; padding:6px;">Технологическое обслуживание и подпитка бассейна (V=${inputs.poolVolume} м³)</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">м³</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">3%/сут</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center;">1</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center; font-weight:bold;">${results.waterPool.toFixed(3)}</td>
      <td style="border:1px solid #000000; padding:6px; text-align:center; font-weight:bold;">${results.sewagePool.toFixed(3)}</td>
    </tr>` : '';

    return `
    <html lang="ru" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://w3.org">
    <head>
      <title>Баланс БВВ Нягань</title>
      <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
      <style>
        body { font-family: "Times New Roman", Times, serif; font-size: 14px; line-height: 1.4; color: #000000; padding: 20px; }
        p.docText { text-indent: 1.25cm; text-align: justify; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11pt; }
        th { background-color: #f2f2f2; font-weight: bold; border: 1px solid #000000; padding: 6px; }
      </style>
    </head>
    <body>
      <div style="margin-left: auto; width: 280px; text-align: left; font-size: 11pt; margin-bottom: 30px;">
        <p style="font-weight: bold; margin: 0 0 4px 0;">В ${inputs.organization || '_____________________'}</p>
        <p style="margin: 0;">От: <b>${inputs.fio || '_____________________'}</b></p>
        <p style="margin: 0;">Адрес объекта: г. Нягань, ${inputs.address || '_____________________'}</p>
        <p style="margin: 0;">Тел: ${inputs.phone || '_____________________'}</p>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">Баланс водопотребления и водоотведения</h1>
        <p style="margin: 4px 0 0 0; font-size: 11pt;">объекта индивидуального жилищного строительства (ИЖС)</p>
      </div>

      <p class="docText">
        Настоящий расчет водохозяйственного баланса выполнен для обоснования заявляемых объемов водопотребления и водоотведения строящегося (реконструируемого) жилого дома в соответствии с требованиями СП 30.13330.2020 «Внутренний водопровод и活用 канализация зданий».
      </p>

      <table>
        <thead>
          <tr>
            <th style="width: 5%;">№</th>
            <th style="width: 45%; text-align: left;">Наименование видов нужд</th>
            <th style="width: 10%;">Ед. изм.</th>
            <th style="width: 10%;">Норма</th>
            <th style="width: 10%;">Кол-во</th>
            <th style="width: 10%;">Водопотр.</th>
            <th style="width: 10%;">Водоотв.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000000; padding: 6px; text-align: center;">1</td>
            <td style="border: 1px solid #000000; padding: 6px;">Хозяйственно-бытовые нужды жилого дома (проживание граждан, приготовление пищи, гигиена)</td>
            <td style="border: 1px solid #000000; padding: 6px; text-align: center;">чел.</td>
            <td style="border: 1px solid #000000; padding: 6px; text-align: center;">210</td>
            <td style="border: 1px solid #000000; padding: 6px; text-align: center;">${inputs.residents}</td>
            <td style="border: 1px solid #000000; padding: 6px; text-align: center; font-weight: bold;">${results.waterPeople.toFixed(3)}</td>
            <td style="border: 1px solid #000000; padding: 6px; text-align: center; font-weight: bold;">${results.sewagePeople.toFixed(3)}</td>
          </tr>
          ${gardenRow}
          ${banyaRow}
          ${poolRow}
          <tr style="font-weight: bold;">
            <td colspan="5" style="border: 1px solid #000000; padding: 10px; text-align: right; text-transform: uppercase;">Итого (м³/сут):</td>
            <td style="border: 1px solid #000000; padding: 10px; text-align: center; color: #1d4ed8;">${results.totalWater.toFixed(3)}</td>
            <td style="border: 1px solid #000000; padding: 10px; text-align: center; color: #1d4ed8;">${results.totalSewage.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 25px; font-size: 10pt; font-style: italic;">
        <p style="margin: 4px 0;"><b>Примечание 1:</b> Расход на полив территории принят с коэффициентом водоотведения 0.000 (вода полностью поглощается почвой и растениями).</p>
        ${inputs.hasPool ? '<p style="margin: 4px 0;"><b>Примечание 2:</b> Расход на бассейн учитывает среднесуточное обновление чаши для выполнения санитарных нормативов фильтрации.</p>' : ''}
        <p style="margin: 4px 0;"><b>Примечание 3:</b> Все расчетные нормативы строго соответствуют СП 30.13330.</p>
      </div>

      <table style="width: 100%; border: none; margin-top: 40px; font-size: 12pt;">
        <tr>
          <td style="border: none; width: 50%; text-align: left; vertical-align: top;">
            Дата: ${inputs.fio ? currentDate : '«____» ____________ 202___ г.'}
          </td>
          <td style="border: none; width: 50%; text-align: right; vertical-align: top;">
            Подпись заявителя: _____________________<br/>
            <span style="font-size: 10pt; color: #6b7280;">( ${inputs.fio || 'Расшифровка подписи'} )</span>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
