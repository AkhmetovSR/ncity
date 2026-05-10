import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Импортируем JobParser
        const JobParser = require('@/lib/parser/job-parser');

        // Режим 'local' — читает из папки pages/
        const parser = new JobParser('local');
        const result = await parser.parseJobs();

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Парсинг завершен успешно',
                jobsCount: result.jobsCount
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Не удалось найти вакансии. Возможно, страницы еще не скачаны.',
                jobsCount: 0
            });
        }

    } catch (error: any) {
        console.error('Ошибка парсинга:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}