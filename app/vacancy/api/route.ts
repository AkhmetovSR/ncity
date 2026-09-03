// // app/vacancy/api/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { getActiveVacancies } from '@/lib/dal/vacancies';
//
// export const dynamic = 'force-dynamic';
//
// export async function GET(request: NextRequest) {
//     // 🌟 СЕНЬОР-ФИКС: Вытаскиваем параметры пагинации из URL (например: /api/vacancies?limit=50&offset=0)
//     const { searchParams } = new URL(request.url);
//     const limit = parseInt(searchParams.get('limit') || '50', 10);
//     const offset = parseInt(searchParams.get('offset') || '0', 10);
//
//     try {
//         // Передаем параметры пагинации в вашу функцию DAL (Data Access Layer)
//         // Примечание: вам нужно будет добавить аргументы limit и offset внутрь getActiveVacancies
//         const vacancies = await getActiveVacancies(limit, offset);
//
//         return NextResponse.json(vacancies, {
//             status: 200,
//             headers: {
//                 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
//             },
//         });
//     } catch (error) {
//         console.error('[API_VACANCIES_GET_ERROR]:', error);
//
//         // Для Vercel возвращаем пустой массив, чтобы фронтенд понимал, что данные "закончились"
//         return NextResponse.json([], {
//             status: 200,
//             headers: {
//                 'Cache-Control': 'no-store, max-age=0'
//             }
//         });
//     }
// }

// app/vacancy/api/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getActiveVacancies } from '@/lib/dal/vacancies';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 1. Проверяем наличие куки сессии
    const cookieStore = request.cookies;
    const existingSession = cookieStore.get('anon_session_id')?.value;

    let sessionId = existingSession;
    let isNewSession = false;

    // 2. Если куки нет — генерируем новый ID
    if (!sessionId) {
        sessionId = `anon_${globalThis.crypto?.randomUUID() || Math.random().toString(36).substring(2)}`;
        isNewSession = true;
    }

    try {
        const vacancies = await getActiveVacancies(limit, offset);

        const response = NextResponse.json(vacancies, { status: 200 });

        // 3. Установка заголовков кэширования
        // 🌟 СЕНЬОР-ФИКС 1: Если мы ставим новую куку (Set-Cookie), кэшировать ответ НЕЛЬЗЯ,
        // иначе первый сгенерированный ID закэшируется на сервере/CDN и прилетит ВСЕМ пользователям!
        if (isNewSession) {
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        } else {
            response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
        }

        // 4. Запекаем куку
        if (isNewSession && sessionId) {
            response.cookies.set('anon_session_id', sessionId, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 365,

                // 🌟 СЕНЬОР-ФИКС 2: Меняем 'strict' на 'lax'.
                // Режим 'strict' часто сбрасывает куку в PWA/webview при холодных стартах с главного экрана смартфона.
                sameSite: 'lax',

                // Авто-определение secure: на VPS (production) будет true
                secure: process.env.NODE_ENV === 'production',
            });
        }

        return response;
    } catch (error) {
        console.error('[API_VACANCIES_GET_ERROR]:', error);

        return NextResponse.json([], {
            status: 200,
            headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
    }
}