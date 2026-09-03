// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Структура для хранения истории запросов в оперативной памяти сервера
interface RateLimitRecord {
    timestamps: number[];
}

// Карта для отслеживания IP-адресов. Очищается сама при перезапуске сервера.
const ipCache = new Map<string, RateLimitRecord>();

// Конфигурация лимитов: максимум 3 запроса за 5 минут (300 000 миллисекунд)
const LIMIT_WINDOW = 60 * 1000; // 1 минута
const MAX_REQUESTS = 5;

export function proxy(request: NextRequest) {
    const now = Date.now();

    // 1. Извлекаем IP-адрес пользователя (подходит для Vercel и стандартных прокси)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    // 2. Получаем или создаем историю запросов для этого IP
    if (!ipCache.has(ip)) {
        ipCache.set(ip, { timestamps: [] });
    }

    const record = ipCache.get(ip)!;

    // 3. Отфильтровываем старые запросы, которые вышли за рамки 5-минутного окна
    record.timestamps = record.timestamps.filter(
        (timestamp) => now - timestamp < LIMIT_WINDOW
    );

    // 4. Проверяем, не превысил ли пользователь лимит
    if (record.timestamps.length >= MAX_REQUESTS) {
        console.warn(`[RATE_LIMIT_BLOCKED]: Превышен лимит запросов с IP: ${ip}`);

        return new NextResponse(
            JSON.stringify({
                error: 'Слишком много запросов. Вы можете добавлять не более 3 вакансий каждые 5 минут.'
            }),
            {
                status: 429,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    // 5. Записываем текущий успешный запрос в историю
    record.timestamps.push(now);
    return NextResponse.next();
}

/**
 * Настройка области действия (Matcher).
 * Инструктирует Next.js запускать этот фильтр СТРОГО на нашем API создания вакансии.
 * Статический контент, картинки и роуты страниц этот скрипт нагружать и замедлять не будет.
 */
export const config = {
    matcher: '/vacancy/api/create',
};
