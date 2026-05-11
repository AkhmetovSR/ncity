import { NextResponse } from 'next/server';
import { Fetcher } from '@/lib/parser/fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const fetcher = new Fetcher();

        // Получаем список вакансий
        const vacanciesList = await fetcher.fetchVacanciesList(0);

        if (!vacanciesList || vacanciesList.length === 0) {
            return NextResponse.json({ error: 'Нет вакансий' }, { status: 404 });
        }

        const firstVacancy = vacanciesList[0];
        console.log(`📌 Вакансия: ${firstVacancy.profession}`);

        // Получаем детали через правильный API
        const details = await fetcher.fetchVacancyDetails(firstVacancy.id, firstVacancy.companyCode);

        if (!details) {
            return NextResponse.json({ error: 'Не удалось получить детали' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            vacancy: details
        });

    } catch (error: any) {
        console.error('❌ Ошибка:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}