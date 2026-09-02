// app/vacancy/api/create/route.ts
import { NextResponse } from 'next/server';
import { vacancyCreateSchema } from '@/app/vacancy/_schemas/vacancyValidation';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. ПРОВЕРКА HONEYPOT (ЛОВУШКА ДЛЯ БОТОВ)
        // Если поле hpEmail заполнено ХОТЬ ЧЕМ-ТО — это 100% автоматический бот.
        if (body.hpEmail && body.hpEmail.trim() !== '') {
            console.warn('--- БОТ ЗАФИКСИРОВАН ПО HONEYPOT ---');

            // Возвращаем фейковый успешный ответ 201, чтобы бот думал, что преуспел,
            // и не пытался подбирать другие стратегии обхода. Но в БД ничего не пишем!
            return NextResponse.json(
                { message: 'Вакансия успешно отправлена на модерацию' },
                { status: 201 }
            );
        }

        // 2. Валидируем данные через Zod-схему (Твой старый код без изменений)
        const validation = vacancyCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Ошибка валидации данных',
                    details: validation.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const safeData = validation.data;
        console.log('Безопасные данные готовы к записи в БД:', safeData);

        return NextResponse.json(
            { message: 'Вакансия успешно отправлена на модерацию' },
            { status: 201 }
        );

    } catch (error) {
        console.error('[API_VACANCY_CREATE_ERROR]:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}
