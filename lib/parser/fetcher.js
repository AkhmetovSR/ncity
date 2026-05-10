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
        const filepath = path.join(config.PAGES_DIR, `page_${pageNum}_raw.html`);
        try {
            const buffer = await fs.readFile(filepath);
            const decoded = iconv.decode(buffer, 'win1251');
            console.log(`   ✅ RAW файл декодирован (win1251 → UTF-8)`);
            return decoded;
        } catch (e) {
            console.log(`   ❌ Файл page_${pageNum}_raw.html не найден`);
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

        // ✅ Сохраняем копию в /tmp для отладки (опционально)
        if (process.env.VERCEL) {
            const fs = require('fs').promises;
            const path = require('path');
            const config = require('./config');
            await fs.mkdir(config.PAGES_DIR, { recursive: true });
            await fs.writeFile(
                path.join(config.PAGES_DIR, `page_${pageNum}_raw.html`),
                Buffer.from(buffer)
            );
        }

        return decoded;
    }
}

module.exports = Fetcher;