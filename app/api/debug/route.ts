import { NextResponse } from 'next/server';
import { TrudvsemParser } from '@/lib/parser/sources/trudvsem';
import { IrCenterParser } from '@/lib/parser/sources/ir-center';

export const dynamic = 'force-dynamic';

export async function GET() {
    const results = {
        trudvsem: null as any,
        irCenter: null as any,
        errors: [] as string[]
    };

    // 1. Парсим первую вакансию с trudvsem.ru
    console.log('\n📌 trudvsem.ru - первая вакансия');
    console.log('─'.repeat(40));

    try {
        const trudvsemParser = new TrudvsemParser();

        // Получаем список вакансий (первая страница)
        const vacanciesList = await trudvsemParser.fetchVacanciesList(0);

        if (vacanciesList && vacanciesList.length > 0) {
            const firstVacancy = vacanciesList[0];
            const vacancyId = firstVacancy[0];
            const companyCode = firstVacancy[2];
            const vacancyName = firstVacancy[1];

            console.log(`📍 Найдена вакансия: ${vacancyName}`);

            // Получаем детали
            const details = await trudvsemParser.fetchVacancyDetails(vacancyId, companyCode);

            if (details) {
                results.trudvsem = {
                    id: vacancyId,
                    profession: details.vacancyName || vacancyName,
                    organization: details.fullCompanyName,
                    salary: trudvsemParser.formatSalary(details.salaryMin, details.salaryMax),
                    district: details.stateRegion,
                    address: details.fullAddress,
                    date: new Date(details.publishedDate).toLocaleDateString('ru-RU'),
                    schedule: trudvsemParser.formatSchedule(details.scheduleType),
                    busyType: details.busyType,
                    description: details.positionResponsibilities?.substring(0, 300) + '...',
                    phone: details.contacts?.['Телефон'],
                    email: details.contacts?.['Email'],
                    website: details.companyDTO?.site
                };
                console.log('✅ Успешно получена детальная информация');
            } else {
                results.errors.push('trudvsem.ru: не удалось получить детали');
            }
        } else {
            results.errors.push('trudvsem.ru: вакансии не найдены');
        }

    } catch (error: any) {
        results.errors.push(`trudvsem.ru: ${error.message}`);
        console.error('❌ Ошибка trudvsem.ru:', error.message);
    }

    // 2. Парсим первую вакансию с ir-center.ru
    console.log('\n📌 ir-center.ru - первая вакансия');
    console.log('─'.repeat(40));

    try {
        const irCenterParser = new IrCenterParser();

        // Парсим первую страницу
        const url = `${irCenterParser.cfg.BASE_URL}${irCenterParser.cfg.VACANCY_PATH}?${irCenterParser.cfg.BASE_PARAMS}&page=1`;

        const response = await fetch(url, {
            headers: { 'User-Agent': irCenterParser.cfg.USER_AGENT }
        });

        const buffer = await response.arrayBuffer();
        const decoded = irCenterParser.decodeBuffer(buffer);
        const $ = require('cheerio').load(decoded);

        const jobs = irCenterParser.parseTable($, 1);

        if (jobs && jobs.length > 0) {
            const firstJob = jobs[0];
            results.irCenter = {
                id: null,
                profession: firstJob.profession,
                organization: firstJob.organization,
                salary: firstJob.salary,
                district: firstJob.district,
                address: 'Не указан',
                date: firstJob.date,
                schedule: firstJob.schedule,
                busyType: firstJob.busyType,
                description: firstJob.description,
                phone: firstJob.phone,
                email: firstJob.email,
                website: firstJob.website
            };
            console.log(`✅ Найдена вакансия: ${firstJob.profession}`);
        } else {
            results.errors.push('ir-center.ru: вакансии не найдены');
        }

    } catch (error: any) {
        results.errors.push(`ir-center.ru: ${error.message}`);
        console.error('❌ Ошибка ir-center.ru:', error.message);
    }

    // 3. Возвращаем результат
    return NextResponse.json({
        success: results.trudvsem !== null || results.irCenter !== null,
        sources: results,
        total: (results.trudvsem ? 1 : 0) + (results.irCenter ? 1 : 0),
        errors: results.errors.length > 0 ? results.errors : null
    });
}