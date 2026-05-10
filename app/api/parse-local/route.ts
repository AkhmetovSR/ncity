import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Проверяем, существуют ли файлы перед запуском парсера
        const pagesDir = process.env.VERCEL ? '/tmp/parser-pages' : path.join(process.cwd(), 'pages');

        console.log(`🔍 Проверка папки: ${pagesDir}`);

        // Проверяем, существует ли папка
        try {
            await fs.access(pagesDir);
            console.log(`✅ Папка существует`);
        } catch {
            console.log(`❌ Папка не существует`);
            return NextResponse.json({
                success: false,
                error: `Папка с данными не найдена: ${pagesDir}. Сначала скачайте страницы.`
            }, { status: 404 });
        }

        // Проверяем, есть ли файлы
        const files = await fs.readdir(pagesDir);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        console.log(`📄 Найдено HTML файлов: ${htmlFiles.length}`);

        if (htmlFiles.length === 0) {
            return NextResponse.json({
                success: false,
                error: `Нет HTML файлов в папке ${pagesDir}. Сначала скачайте страницы.`
            }, { status: 404 });
        }

        console.log(`Файлы: ${htmlFiles.join(', ')}`);

        // Теперь запускаем парсер
        const JobParser = require('@/lib/parser/job-parser');
        const parser = new JobParser('local');
        const result = await parser.parseJobs();

        if (result.success && result.jobsCount > 0) {
            return NextResponse.json({
                success: true,
                message: 'Парсинг завершен успешно',
                jobsCount: result.jobsCount
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Не удалось найти вакансии. Возможно, структура страниц изменилась.',
                jobsCount: 0,
                debug: { pagesDir, filesCount: htmlFiles.length }
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