import { NextRequest, NextResponse } from 'next/server';

// Увеличиваем таймаут до максимума для Vercel Hobby (60 сек)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Проверка секретного токена (безопасность)
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.PARSER_SECRET_TOKEN;

        if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Динамический импорт для уменьшения времени загрузки
        const JobParser = require('@/lib/parser/job-parser');

        // Режим: 'online' или 'local'
        const mode = request.nextUrl.searchParams.get('mode') || 'online';
        const parser = new JobParser(mode);

        // Запускаем парсинг
        await parser.parseJobs();

        return NextResponse.json({
            success: true,
            message: 'Парсинг завершен успешно',
            jobsCount: parser.allJobs?.length || 0
        });

    } catch (error: any) {
        console.error('Parser error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}