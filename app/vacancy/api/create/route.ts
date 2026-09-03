// // app/vacancy/api/create/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { vacancyCreateSchema } from '@/app/vacancy/_schemas/vacancyValidation';
// import { createVacancy } from '@/lib/dal/vacancies';
// import { Vacancy } from '@/types/vacancy';
//
// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//
//         // 1. ПРОВЕРКА HONEYPOT (ЛОВУШКА ДЛЯ БОТОВ)
//         if (body.hpEmail && body.hpEmail.trim() !== '') {
//             console.warn('--- БОТ ЗАФИКСИРОВАН ПО HONEYPOT ---');
//             return NextResponse.json(
//                 { message: 'Вакансия успешно отправлена на модерацию' },
//                 { status: 201 }
//             );
//         }
//
//         // 2. Валидируем данные через Zod-схему
//         const validation = vacancyCreateSchema.safeParse(body);
//
//         if (!validation.success) {
//             return NextResponse.json(
//                 {
//                     error: 'Ошибка валидации данных',
//                     details: validation.error.flatten().fieldErrors
//                 },
//                 { status: 400 }
//             );
//         }
//
//         // 3. СЕНЬОР-ФИКС: Официальное и 100% надежное чтение кук в Next.js без RegExp
//         const serverAuthorId = request.cookies.get('anon_session_id')?.value;
//
//         if (!serverAuthorId) {
//             return NextResponse.json(
//                 { error: 'Сессия не найдена. Перезагрузите страницу.' },
//                 { status: 401 }
//             );
//         }
//
//         // 4. СЕНЬОР-ФИКС: Приводим данные Zod к строгому соответствию интерфейсу Vacancy
//         const safeData: Vacancy & { author_id: string } = {
//             author_id: serverAuthorId,
//             profession: validation.data.profession,
//             organization: validation.data.organization,
//             description: validation.data.description,
//
//             // Превращаем undefined в пустые строки для 100% соответствия типам
//             salary: String(validation.data.salary || ''),
//             district: String(validation.data.district || ''),
//             schedule: String(validation.data.schedule || ''),
//             // busyType: String(validation.data.busyType || ''), // 🌟 ФИКС: Явно приводим к string
//             date: new Date().toLocaleDateString('ru-RU'),
//
//             // Необязательные текстовые поля прокидываем безопасно
//             requirements: validation.data.requirements || '',
//         };
//
//         // 5. Записываем готовую вакансию в PostgreSQL через наш DAL слой
//         await createVacancy(safeData);
//
//         console.log('Вакансия успешно сохранена в базу данных:', safeData);
//
//         return NextResponse.json(
//             { message: 'Вакансия успешно отправлена на модерацию' },
//             { status: 201 }
//         );
//
//     } catch (error) {
//         console.error('[API_VACANCY_CREATE_ERROR]:', error);
//         return NextResponse.json(
//             { error: 'Внутренняя ошибка сервера' },
//             { status: 500 }
//         );
//     }
// }

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

        // 3. 🌟 ТЕСТОВЫЙ ЛОГ ДЛЯ ДИАГНОСТИКИ СЕССИИ
        const allCookies = request.cookies.getAll();
        console.log('--- ДИАГНОСТИКА КУК НА СЕРВЕРЕ ---');
        console.log('Все доступные куки в запросе:', allCookies);
        console.log('Заголовок Cookie целиком:', request.headers.get('cookie'));

        const serverAuthorId = request.cookies.get('anon_session_id')?.value;

        // Если кука не долетела, возвращаем развернутый ответ для вывода на фронтенде
        if (!serverAuthorId) {
            const cookieNames = allCookies.map(c => c.name).join(', ') || 'пусто';
            return NextResponse.json(
                {
                    error: `Сессия не найдена. На сервере доступно кук: ${allCookies.length} (${cookieNames}). Перезагрузите страницу.`
                },
                { status: 401 }
            );
        }

        // 4. Приводим данные Zod к строгому соответствию интерфейсу Vacancy
        const safeData: Vacancy & { author_id: string } = {
            author_id: serverAuthorId,
            profession: validation.data.profession,
            organization: validation.data.organization,
            description: validation.data.description,

            // Гарантируем тип string, превращая undefined в пустые строки
            salary: String(validation.data.salary || ''),
            district: String(validation.data.district || ''),
            schedule: String(validation.data.schedule || ''),
            // busyType: String(validation.data.busyType || ''),
            date: new Date().toLocaleDateString('ru-RU'),

            requirements: validation.data.requirements || '',
        };

        // 5. Записываем готовую вакансию в PostgreSQL через наш DAL слой
        await createVacancy(safeData);

        console.log('Вакансия успешно сохранена в базу данных:', safeData);

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
