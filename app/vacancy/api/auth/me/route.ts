// app/vacancy/api/auth/me/route.ts
import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // 🌟 СЕНЬОР-ФИКС: Безопасно читаем HttpOnly куку прямо на сервере
    const cookieStore = request.cookies;
    const sessionId = cookieStore.get('anon_session_id')?.value;

    // Если куки по какой-то причине нет (например, первый хит, и GET /api еще не отработал)
    if (!sessionId) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    // Возвращаем фронтенду объект пользователя.
    // Вместо ФИО из Яндекса пока отдаем красивую сеньорскую заглушку Анонима
    return NextResponse.json({
        user: {
            id: sessionId,          // Передаем реальный ID из защищенной куки
            name: `Работодатель #${sessionId.substring(5, 9)}`, // Делаем имя уникальным по хэшу куки
            email: 'anon@local.jobs',
            avatar: '🕵️‍♂️',
            isAnonymous: true       // Пометка для UI, что это анонимная сессия
        }
    }, { status: 200 });
}
