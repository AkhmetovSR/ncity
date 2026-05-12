import fs from 'fs/promises';
import path from 'path';
import iconv from 'iconv-lite';
import { config } from '@/lib/config/config';

export class Fetcher {
    private readonly mode: string;

    constructor(mode: string = 'local') {
        this.mode = mode;
    }

    async fetchPage(pageNum: number): Promise<string | null> {
        return this.mode === 'local'
            ? this.fetchLocal(pageNum)
            : this.fetchOnline(pageNum);
    }

    private async fetchLocal(pageNum: number): Promise<string | null> {
        const filepath = path.join(config.PAGES_DIR, `page_${pageNum}_raw.html`);
        try {
            const buffer = await fs.readFile(filepath);
            const decoded = iconv.decode(buffer, 'win1251');
            console.log(`   ✅ RAW файл декодирован (win1251 → UTF-8)`);
            return decoded;
        } catch (e: unknown) {
            console.log(`   ❌ Ошибка чтения файла: ${e instanceof Error ? e.message : String(e)}`);
            return null;
        }
    }

    private async fetchOnline(pageNum: number): Promise<string | null> {
        // Формируем URL с учетом пагинации
        let url: string;
        if (pageNum === 1) {
            url = `${config.BASE_URL}${config.VACANCY_PATH}?${config.BASE_PARAMS}`;
        } else {
            url = `${config.BASE_URL}${config.VACANCY_PATH}?${config.BASE_PARAMS}&page=${pageNum}`;
        }

        console.log(`   🌐 Загрузка: ${url.substring(0, 100)}...`);

        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': config.USER_AGENT }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            const decoded = iconv.decode(Buffer.from(buffer), 'win1251');
            console.log(`   ✅ RAW файл декодирован (win1251 → UTF-8)`);
            return decoded;
        } catch (e: unknown) {
            console.log(`   ❌ Ошибка запроса: ${e instanceof Error ? e.message : String(e)}`);
            return null;
        }
    }
}