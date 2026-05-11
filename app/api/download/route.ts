import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function randomDelay() {
    const min = config.MIN_DELAY_MS;
    const max = config.MAX_DELAY_MS;
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(`   ⏳ Пауза ${Math.round(delay / 1000)} сек...`);
    await new Promise(resolve => setTimeout(resolve, delay));
}

// Функция для удаления старых файлов
async function cleanOldPages(pagesDir: string): Promise<void> {
    try {
        const files = await fs.readdir(pagesDir);
        const maxAgeDays = config.PAGES_MAX_AGE_DAYS || 3;
        const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
        const cutoffDate = Date.now() - maxAgeMs;

        let deletedCount = 0;

        for (const file of files) {
            const filePath = path.join(pagesDir, file);
            const stats = await fs.stat(filePath);

            if (stats.mtimeMs < cutoffDate) {
                await fs.unlink(filePath);
                console.log(`   🗑️ Удален старый файл: ${file} (${new Date(stats.mtime).toLocaleDateString()})`);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            console.log(`   ✅ Удалено старых файлов: ${deletedCount}`);
        }

    } catch (error) {
        console.log(`   ⚠️ Ошибка при очистке: ${error}`);
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('mode') || 'local';

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

        // Очищаем старые файлы перед скачиванием
        console.log('🧹 Очистка старых файлов (старше 3 дней)...');
        await cleanOldPages(pagesDir);

        console.log('📥 Начинаем скачивание страниц...\n');

        const downloadedPages = [];

        for (let page = 1; page <= config.MAX_PAGES; page++) {
            const url = `${config.BASE_URL}${config.VACANCY_PATH}?${config.BASE_PARAMS}&page=${page}`;
            const filepath = path.join(pagesDir, `page_${page}_raw.html`);

            try {
                console.log(`📄 Скачиваю страницу ${page}...`);

                const response = await fetch(url, {
                    headers: { 'User-Agent': config.USER_AGENT }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const buffer = await response.arrayBuffer();
                await fs.writeFile(filepath, Buffer.from(buffer));

                const sizeKB = Math.round(buffer.byteLength / 1024);
                console.log(`   ✅ Страница ${page} сохранена (${sizeKB} KB)`);
                downloadedPages.push(page);

                if (page < config.MAX_PAGES) {
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
            message: `Успешно скачано ${config.MAX_PAGES} страниц`,
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