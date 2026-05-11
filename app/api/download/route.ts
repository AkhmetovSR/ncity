import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import iconv from 'iconv-lite';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://ir-center.ru';
const VACANCY_PATH = '/sznregion/dsktop/czninfo.asp';
const BASE_PARAMS = 'rn=%E3%20%CD%FF%E3%E0%ED%FC&rg=86&Profession=&sort=';
const MAX_PAGES = 10;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function randomDelay() {
    const min = 1500;
    const max = 3500;
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(`   ⏳ Пауза ${Math.round(delay / 1000)} сек...`);
    await new Promise(resolve => setTimeout(resolve, delay));
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('mode') || 'local'; // local, vercel, online

        let pagesDir: string;

        // Определяем папку в зависимости от режима
        switch (mode) {
            case 'vercel':
                pagesDir = '/tmp/parser-pages';
                break;
            case 'local':
            default:
                pagesDir = path.join(process.cwd(), 'pages');
                break;
        }

        console.log(`📥 Режим: ${mode}, папка: ${pagesDir}`);

        // Для онлайн режима не скачиваем файлы
        if (mode === 'online') {
            return NextResponse.json({
                success: true,
                mode: 'online',
                message: 'Режим онлайн: парсинг будет выполняться без скачивания файлов'
            });
        }

        // Создаем папку
        await fs.mkdir(pagesDir, { recursive: true });

        console.log('📥 Начинаем скачивание страниц...\n');

        const downloadedPages = [];

        for (let page = 1; page <= MAX_PAGES; page++) {
            const url = `${BASE_URL}${VACANCY_PATH}?${BASE_PARAMS}&page=${page}`;
            const filepath = path.join(pagesDir, `page_${page}_raw.html`);

            try {
                console.log(`📄 Скачиваю страницу ${page}...`);

                const response = await fetch(url, {
                    headers: { 'User-Agent': USER_AGENT }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const buffer = await response.arrayBuffer();
                await fs.writeFile(filepath, Buffer.from(buffer));

                const sizeKB = Math.round(buffer.byteLength / 1024);
                console.log(`   ✅ Страница ${page} сохранена (${sizeKB} KB)`);
                downloadedPages.push(page);

                if (page < MAX_PAGES) {
                    await randomDelay();
                }

            } catch (error: any) {
                console.log(`   ❌ Ошибка: ${error.message}`);
                return NextResponse.json({
                    success: false,
                    error: `Ошибка при скачивании страницы ${page}: ${error.message}`,
                    downloadedPages: downloadedPages
                }, { status: 500 });
            }
        }

        console.log('\n✅ Все страницы успешно скачаны!');

        return NextResponse.json({
            success: true,
            mode: mode,
            message: `Успешно скачано ${MAX_PAGES} страниц`,
            pagesDir: pagesDir,
            downloadedPages: downloadedPages
        });

    } catch (error: any) {
        console.error('Ошибка:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}