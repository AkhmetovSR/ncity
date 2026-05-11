import { Fetcher, VacancyApiItem } from './fetcher';
import { TableParser, Vacancy } from './table-parser';
import { Storage } from './storage';
import { config } from '@/lib/config';

export class JobParser {
    private fetcher: Fetcher;
    private storage: Storage;
    public allJobs: Vacancy[] = [];
    private currentPage: number = 1;

    constructor() {
        this.fetcher = new Fetcher();
        this.storage = new Storage();
    }

    async parseJobs(): Promise<{ success: boolean; jobsCount: number; message?: string; total?: number }> {
        console.log(`🚀 Запуск парсера (API trudvsem.ru)`);
        console.log(`🔍 Поиск: "${config.TITLE}" в регионе ${config.REGION_CODE}\n`);

        let totalVacancies = 0;
        let hasMorePages = true;

        while (hasMorePages && this.currentPage <= config.MAX_PAGES) {
            console.log(`\n📄 Страница ${this.currentPage}`);

            const apiItems = await this.fetcher.fetchPage(this.currentPage);

            if (!apiItems || apiItems.length === 0) {
                console.log(`🏁 Страница ${this.currentPage} пуста, завершаем`);
                break;
            }

            const tableParser = new TableParser(this.currentPage);
            const jobs = tableParser.parseVacancies(apiItems);

            if (jobs.length > 0) {
                this.allJobs.push(...jobs);
                totalVacancies += jobs.length;
                console.log(`   ✅ Добавлено ${jobs.length} вакансий (всего: ${this.allJobs.length})`);
            }

            // Проверяем, есть ли еще страницы
            // Это нужно будет получить из API, но пока просто проверяем
            this.currentPage++;

            if (this.currentPage <= config.MAX_PAGES) {
                await this.fetcher.delay();
            }
        }

        if (this.allJobs.length > 0) {
            await this.storage.saveResults(this.allJobs);
            this.showStats();
            return {
                success: true,
                jobsCount: this.allJobs.length,
                total: totalVacancies,
                message: `Успешно собрано ${this.allJobs.length} вакансий`
            };
        }

        return { success: false, jobsCount: 0, message: 'Вакансии не найдены' };
    }

    async parseJobsRaw(): Promise<Vacancy[]> {
        this.allJobs = [];
        this.currentPage = 1;

        while (this.currentPage <= config.MAX_PAGES) {
            const apiItems = await this.fetcher.fetchPage(this.currentPage);
            if (!apiItems || apiItems.length === 0) break;

            const tableParser = new TableParser(this.currentPage);
            const jobs = tableParser.parseVacancies(apiItems);
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