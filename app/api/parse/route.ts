import { NextResponse } from 'next/server';
import { JobParser } from '@/lib/parser/job-parser';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
    const startTime = Date.now();

    try {
        console.log('🚀 API /api/parse вызван');

        const parser = new JobParser();
        const result = await parser.parseJobs();

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        console.log(`⏱️ Завершено за ${duration} сек.`);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message || 'Парсинг завершен успешно',
                jobsCount: result.jobsCount,
                duration: `${duration} сек.`
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.message || 'Не удалось найти вакансии'
            }, { status: 404 });
        }

    } catch (error: any) {
        console.error('❌ Ошибка парсинга:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}