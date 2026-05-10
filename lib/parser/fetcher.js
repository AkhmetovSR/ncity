const fs = require('fs').promises;
const path = require('path');
const iconv = require('iconv-lite');
const config = require('./config');

class Fetcher {
    constructor(mode = 'local') {
        this.mode = mode;
    }

    async fetchPage(pageNum) {
        return this.mode === 'local'
            ? this.fetchLocal(pageNum)
            : this.fetchOnline(pageNum);
    }

    async fetchLocal(pageNum) {
        // Используем config.PAGES_DIR из конфига
        const filepath = path.join(config.PAGES_DIR, `page_${pageNum}_raw.html`);
        console.log(`   📂 Ищу файл: ${filepath}`);

        try {
            const buffer = await fs.readFile(filepath);
            console.log(`   📄 Файл найден, размер: ${buffer.length} байт`);

            const decoded = iconv.decode(buffer, 'win1251');
            console.log(`   ✅ RAW файл декодирован (win1251 → UTF-8)`);

            // Проверяем, есть ли таблица в HTML
            if (decoded.includes('<table') && decoded.includes('vacancy')) {
                console.log(`   ✅ В HTML найдена таблица с вакансиями`);
            } else {
                console.log(`   ⚠️ В HTML не найдена таблица с вакансиями`);
            }

            return decoded;
        } catch (e) {
            console.log(`   ❌ Ошибка чтения файла page_${pageNum}_raw.html: ${e.message}`);
            return null;
        }
    }

    async fetchOnline(pageNum) {
        const url = `${config.BASE_URL}${config.VACANCY_PATH}?${config.BASE_PARAMS}&page=${pageNum}`;

        const response = await fetch(url, {
            headers: { 'User-Agent': config.USER_AGENT }
        });

        const buffer = await response.arrayBuffer();
        const decoded = iconv.decode(Buffer.from(buffer), 'win1251');

        return decoded;
    }
}

module.exports = Fetcher;