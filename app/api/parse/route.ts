import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('mode') || 'online'; // local, vercel, online

        let pagesDir: string | null = null;

        // Определяем режим работы
        if (mode === 'local') {
            pagesDir = path.join(process.cwd(), 'pages');
            console.log(`🔍 Режим: локальный, папка: ${pagesDir}`);

            // Проверяем наличие файлов
            try {
                await fs.access(pagesDir);
                const files = await fs.readdir(pagesDir);
                const htmlFiles = files.filter(f => f.endsWith('.html'));

                if (htmlFiles.length === 0) {
                    return NextResponse.json({
                        success: false,
                        error: 'Нет скачанных страниц. Сначала скачайте страницы в локальном режиме.'
                    }, { status: 404 });
                }

                console.log(`✅ Найдено ${htmlFiles.length} HTML файлов`);
            } catch {
                return NextResponse.json({
                    success: false,
                    error: 'Папка pages не найдена. Сначала скачайте страницы в локальном режиме.'
                }, { status: 404 });
            }
        } else if (mode === 'vercel') {
            pagesDir = '/tmp/parser-pages';
            console.log(`🔍 Режим: Vercel, папка: ${pagesDir}`);

            // Проверяем наличие файлов
            try {
                await fs.access(pagesDir);
                const files = await fs.readdir(pagesDir);
                const htmlFiles = files.filter(f => f.endsWith('.html'));

                if (htmlFiles.length === 0) {
                    return NextResponse.json({
                        success: false,
                        error: 'Нет скачанных страниц на Vercel. Сначала скачайте страницы в режиме Vercel.'
                    }, { status: 404 });
                }

                console.log(`✅ Найдено ${htmlFiles.length} HTML файлов`);
            } catch {
                return NextResponse.json({
                    success: false,
                    error: 'Папка /tmp/parser-pages не найдена на Vercel.'
                }, { status: 404 });
            }
        } else {
            console.log(`🔍 Режим: онлайн (прямой парсинг с сайта)`);
        }

        // Импортируем JobParser
        const JobParser = require('@/lib/parser/job-parser');

        // Передаем режим в парсер
        // 'local' или 'vercel' будут использовать fetchLocal, 'online' - fetchOnline
        const parserMode = (mode === 'online') ? 'online' : 'local';
        const parser = new JobParser(parserMode);

        const result = await parser.parseJobs();

        if (result.success && result.jobsCount > 0) {
            return NextResponse.json({
                success: true,
                mode: mode,
                message: 'Парсинг завершен успешно',
                jobsCount: result.jobsCount
            });
        } else {
            return NextResponse.json({
                success: false,
                mode: mode,
                message: result.message || 'Не удалось найти вакансии',
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