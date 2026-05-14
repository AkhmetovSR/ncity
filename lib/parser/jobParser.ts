// lib/JobParser.ts
import { Fetcher } from './fetcher';
import { VacancyDetailsFetcher } from './vacancyDetailsFetcher';
import { Storage } from './storage';
import { config } from '@/lib/config';
import { Vacancy, VacancyApiItem } from '@/types/vacancy';

export class JobParser {
    private readonly fetcher: Fetcher;
    private readonly detailsFetcher: VacancyDetailsFetcher;
    private readonly storage: Storage;
    public allJobs: Vacancy[] = [];

    constructor() {
        this.fetcher = new Fetcher();
        this.detailsFetcher = new VacancyDetailsFetcher();
        this.storage = new Storage();
    }

    // Главный метод запуска парсинга
    async parseJobs(): Promise<{ success: boolean; jobsCount: number; message?: string }> {
        // ШАГ 1: Получаем список ID вакансий
        const allVacanciesList: VacancyApiItem[] = [];

        for (let page = config.START_PAGE; page < config.MAX_PAGES; page++) {
            const items = await this.fetcher.fetchVacanciesList(page);

            if (!items || items.length === 0) break;

            // Добавляем только до лимита
            const remaining = config.MAX_VACANCIES_TO_PARSE - allVacanciesList.length;
            const toAdd = items.slice(0, remaining);
            allVacanciesList.push(...toAdd);

            if (allVacanciesList.length >= config.MAX_VACANCIES_TO_PARSE) break;

            await this.fetcher.delay();
        }

        if (allVacanciesList.length === 0) {
            return { success: false, jobsCount: 0, message: 'Ссылки на вакансии не найдены' };
        }

        // ШАГ 2: Для каждой вакансии получаем детальную информацию
        for (let i = 0; i < allVacanciesList.length; i++) {
            const item = allVacanciesList[i];
            const details = await this.detailsFetcher.fetch(item.id, item.companyCode);

            if (details) {
                this.allJobs.push(details);
            }

            if (i < allVacanciesList.length - 1) {
                await this.detailsFetcher.delay();
            }
        }

        // ШАГ 3: Сохраняем результат
        if (this.allJobs.length > 0) {
            await this.storage.saveResults(this.allJobs);
            return {
                success: true,
                jobsCount: this.allJobs.length,
                message: `Собрано ${this.allJobs.length} вакансий`
            };
        }

        return { success: false, jobsCount: 0, message: 'Вакансии не найдены' };
    }
}