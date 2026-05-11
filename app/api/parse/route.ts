import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';
import { JobParser } from '@/lib/parser/job-parser';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('mode') || 'online';
        const action = searchParams.get('action') || 'save'; // 'edit' или 'save'

        // Проверка наличия файлов для локального режима
        if (mode === 'local') {
            const pagesDir = path.join(process.cwd(), 'pages');
            try {
                await fs.access(pagesDir);
                const files = await fs.readdir(pagesDir);
                const htmlFiles = files.filter(f => f.endsWith('.html'));

                if (htmlFiles.length === 0) {
                    return NextResponse.json({
                        success: false,
                        error: 'Нет скачанных страниц. Сначала скачайте страницы.'
                    }, { status: 404 });
                }
            } catch {
                return NextResponse.json({
                    success: false,
                    error: 'Папка pages не найдена.'
                }, { status: 404 });
            }
        } else if (mode === 'vercel') {
            const pagesDir = '/tmp/parser-pages';
            try {
                await fs.access(pagesDir);
            } catch {
                return NextResponse.json({
                    success: false,
                    error: 'Папка /tmp/parser-pages не найдена на Vercel.'
                }, { status: 404 });
            }
        }

        const parserMode = mode === 'online' ? 'online' : 'local';
        const parser = new JobParser(parserMode);

        // Парсим и получаем вакансии
        const vacancies = await parser.parseJobsRaw(); // Новый метод

        if (!vacancies || vacancies.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Вакансии не найдены'
            }, { status: 404 });
        }

        // Если action = 'edit', возвращаем вакансии для редактирования
        if (action === 'edit') {
            return NextResponse.json({
                success: true,
                mode: mode,
                vacancies: vacancies,
                requireEdit: true
            });
        }

        // Иначе (action = 'save') сохраняем
        await parser.saveVacancies(vacancies);

        return NextResponse.json({
            success: true,
            mode: mode,
            message: 'Парсинг завершен',
            jobsCount: vacancies.length
        });

    } catch (error: any) {
        console.error('Ошибка:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}