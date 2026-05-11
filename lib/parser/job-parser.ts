import * as cheerio from 'cheerio';
import { Fetcher } from './fetcher';
import { TableParser } from './table-parser';
import { Storage } from './storage';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class JobParser {
    private readonly mode: string;
    private readonly fetcher: Fetcher;
    private readonly storage: Storage;
    public allJobs: Vacancy[] = [];
    private currentPage: number = 1;

    constructor(mode: string = 'online') {
        this.mode = mode;
        this.fetcher = new Fetcher(mode);
        this.storage = new Storage(mode);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async randomDelay(): Promise<void> {
        const min = config.MIN_DELAY_MS;
        const max = config.MAX_DELAY_MS;
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        console.log(`   ⏳ Пауза ${Math.round(delay / 1000)} сек...`);
        await this.sleep(delay);
    }

    async parseJobs(): Promise<{ success: boolean; jobsCount: number; message?: string }> {
        console.log(`🚀 Запуск парсера (${this.mode === 'local' ? 'локально' : 'онлайн'})\n`);

        while (this.currentPage <= config.MAX_PAGES) {
            console.log(`\n📄 Страница ${this.currentPage}`);

            const html = await this.fetcher.fetchPage(this.currentPage);
            if (!html) {
                console.log(`🏁 Страница ${this.currentPage} не найдена`);
                break;
            }

            const $ = cheerio.load(html);
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
            if (this.mode === 'online' && this.currentPage <= config.MAX_PAGES) {
                await this.randomDelay();
            }
        }

        if (this.allJobs.length) {
            await this.storage.saveResults(this.allJobs);
            this.showStats();
            return { success: true, jobsCount: this.allJobs.length };
        }

        return { success: false, jobsCount: 0, message: 'Вакансии не найдены' };
    }

    async parseJobsRaw(): Promise<Vacancy[]> {
        this.allJobs = [];
        this.currentPage = 1;

        while (this.currentPage <= config.MAX_PAGES) {
            const html = await this.fetcher.fetchPage(this.currentPage);
            if (!html) break;

            const $ = cheerio.load(html);
            const tableParser = new TableParser($, this.currentPage);
            const jobs = tableParser.parseVacancies();
            this.allJobs.push(...jobs);
            this.currentPage++;
        }

        return this.allJobs;
    }

    async saveVacancies(vacancies: Vacancy[]): Promise<void> {
        await this.storage.saveResults(vacancies);
        this.allJobs = vacancies;
        this.showStats();
    }

    private showStats(): void {
        const unique = new Set(this.allJobs.map(j => j.profession));
        console.log(`\n📊 ИТОГО: страниц ${this.currentPage - 1}, вакансий ${this.allJobs.length}, уникальных профессий ${unique.size}`);
    }
}