// app/vacancy/api/create/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { vacancyCreateSchema } from '@/app/vacancy/_schemas/vacancyValidation';
import { createVacancy } from '@/lib/dal/vacancies';
import { Vacancy } from '@/types/vacancy';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 1. ПРОВЕРКА HONEYPOT (ЛОВУШКА ДЛЯ БОТОВ)
        if (body.hpEmail && body.hpEmail.trim() !== '') {
            console.warn('--- БОТ ЗАФИКСИРОВАН ПО HONEYPOT ---');
            return NextResponse.json(
                { message: 'Вакансия успешно отправлена на модерацию' },
                { status: 201 }
            );
        }

        // 2. Валидируем данные через Zod-схему
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

        // 3. СЕНЬОР-ФИКС: Динамическое определение сессии пользователя
        let serverAuthorId = request.cookies.get('anon_session_id')?.value;
        let isNewSession = false;

        // Если куки нет (PWA открыто впервые) — генерируем её прямо в POST-запросе
        if (!serverAuthorId) {
            serverAuthorId = `anon_${globalThis.crypto?.randomUUID() || Math.random().toString(36).substring(2)}`;
            isNewSession = true;
        }

        // 4. Приводим данные Zod к строгому соответствию интерфейсу Vacancy
        const safeData: Vacancy & { author_id: string } = {
            author_id: serverAuthorId,
            profession: validation.data.profession,
            organization: validation.data.organization,
            description: validation.data.description,

            salary: String(validation.data.salary || ''),
            district: String(validation.data.district || ''),
            schedule: String(validation.data.schedule || ''),
            date: new Date().toLocaleDateString('ru-RU'),

            requirements: validation.data.requirements || '',
        };

        // 5. Записываем готовую вакансию в PostgreSQL через наш DAL слой
        await createVacancy(safeData);

        console.log('Вакансия успешно сохранена в базу данных:', safeData);

        const response = NextResponse.json(
            { message: 'Вакансия успешно отправлена на модерацию' },
            { status: 201 }
        );

        // 6. Если сессия новая — запекаем куку в ответе. POST-запрос гарантированно донесет ее до браузера
        if (isNewSession) {
            response.cookies.set('anon_session_id', serverAuthorId, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 365, // 1 год
                sameSite: 'lax',            // Безопасно для PWA внутри одного домена
                secure: process.env.NODE_ENV === 'production',
            });
        }

        return response;

    } catch (error) {
        console.error('[API_VACANCY_CREATE_ERROR]:', error);
        return NextResponse.json(
            { error: 'Внутренняя ошибка сервера' },
            { status: 500 }
        );
    }
}
