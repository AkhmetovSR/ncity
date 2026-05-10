const TableParser = require('./table-parser');
const Fetcher = require('./fetcher');
const Storage = require('./storage');
const config = require('./config');

class JobParser {
    constructor(mode = 'online') {  // changed default to 'online'
        this.mode = mode;
        this.fetcher = new Fetcher(mode);
        this.storage = new Storage(mode);
        this.allJobs = [];
        this.currentPage = 1;
    }

    async parseJobs() {
        console.log(`🚀 Запуск парсера (${this.mode === 'local' ? 'локально' : 'онлайн'})\n`);

        while (this.currentPage <= config.MAX_PAGES) {
            console.log(`\n📄 Страница ${this.currentPage}`);

            const html = await this.fetcher.fetchPage(this.currentPage);

            if (!html) {
                console.log(`🏁 Страница ${this.currentPage} не найдена`);
                break;
            }

            const $ = require('cheerio').load(html);
            const tableParser = new TableParser($, this.currentPage);
            const jobs = tableParser.parseVacancies();

            if (jobs.length === 0 && this.currentPage === 1) {
                console.log('❌ На первой странице нет вакансий');
                break;
            }

            if (jobs.length > 0) {
                this.allJobs.push(...jobs);
                console.log(`   ✅ Добавлено ${jobs.length} вакансий (всего: ${this.allJobs.length})`);
            } else {
                console.log(`   📭 Нет вакансий, завершаем`);
                break;
            }

            this.currentPage++;
        }

        if (this.allJobs.length) {
            const paths = await this.storage.saveResults(this.allJobs);
            console.log(`\n💾 Сохранено:\n   JSON: ${paths.jsonPath}\n   CSV: ${paths.csvPath}`);
            this.showStats();
            return { success: true, jobsCount: this.allJobs.length };
        }

        return { success: false, jobsCount: 0 };
    }

    showStats() {
        const unique = new Set(this.allJobs.map(j => j.profession));
        console.log(`\n📊 ИТОГО: страниц ${this.currentPage - 1}, вакансий ${this.allJobs.length}, уникальных профессий ${unique.size}`);
    }
}

module.exports = JobParser;