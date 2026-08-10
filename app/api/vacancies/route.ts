// import { NextResponse } from 'next/server';
// import { getActiveVacancies } from '@/lib/dal/vacancies';
//
// // force-dynamic сообщает Next.js, что роут не должен кэшироваться при сборке
// export const dynamic = 'force-dynamic';
//
// export async function GET() {
//     try {
//         const vacancies = await getActiveVacancies();
//
//         // Устанавливаем заголовки кэширования, чтобы снизить нагрузку на БД (например, 10 секунд)
//         return NextResponse.json(vacancies, {
//             status: 200,
//             headers: {
//                 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
//             },
//         });
//     } catch (error) {
//         // Логирование детальной ошибки для внутренней системы мониторинга (Sentry, Winston)
//         console.error('[API_VACANCIES_GET_ERROR]:', error);
//
//         // Маскируем ошибку для клиента, возвращая безопасное сообщение и правильный HTTP-статус
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: 'Internal Server Error. Failed to fetch vacancies.'
//             },
//             { status: 500 }
//         );
//     }
// }

// --------------------- VERCEL-------------------------------------------------------
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // ВРЕМЕННО ЗАКОММЕНТИРОВАНО ДЛЯ ДЕПЛОЯ НА VERCEL БЕЗ БД:
        // const vacancies = await getActiveVacancies();
        // return NextResponse.json(vacancies, ...);

        // Возвращаем пустой массив, чтобы сборщик успешно скомпилировал роут со статусом 200
        return NextResponse.json([], {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error('[API_VACANCIES_GET_ERROR]:', error);
        return NextResponse.json([], { status: 200 });
    }
}