// app/api/parse-cron/route.ts
import { NextResponse } from 'next/server';
import { JobParser } from '@/lib/parser/jobParser';

export async function GET() {
    try {
        // Создаем экземпляр парсера
        const parser = new JobParser();

        // Запускаем парсинг
        const result = await parser.parseJobs();

        // Возвращаем результат
        return NextResponse.json({
            success: result.success,
            count: result.jobsCount,
            message: result.message
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        });
    }
}