import { Fetcher, VacancyApiItem } from './fetcher';
import { VacancyDetailsFetcher } from './vacancy-details-fetcher';
import { Storage } from './storage';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

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

    async parseJobs(): Promise<{ success: boolean; jobsCount: number; message?: string }> {
        console.log(`🚀 Запуск парсера trudvsem.ru (API список → детали)`);
        console.log(`📌 Максимум вакансий: ${config.MAX_VACANCIES_TO_PARSE}\n`);

        // ШАГ 1: Получаем список ID вакансий
        const allVacanciesList: VacancyApiItem[] = [];

        for (let page = config.START_PAGE; page < config.MAX_PAGES; page++) {
            console.log(`📄 Страница ${page}...`);

            const items = await this.fetcher.fetchVacanciesList(page);

            if (!items || items.length === 0) break;

            // Добавляем только до лимита
            const remaining = config.MAX_VACANCIES_TO_PARSE - allVacanciesList.length;
            const toAdd = items.slice(0, remaining);
            allVacanciesList.push(...toAdd);

            console.log(`   ✅ Добавлено ${toAdd.length} вакансий (всего: ${allVacanciesList.length}/${config.MAX_VACANCIES_TO_PARSE})`);

            if (allVacanciesList.length >= config.MAX_VACANCIES_TO_PARSE) break;

            await this.fetcher.delay();
        }

        console.log(`\n📊 Собрано ID: ${allVacanciesList.length} из ${config.MAX_VACANCIES_TO_PARSE}`);

        if (allVacanciesList.length === 0) {
            return { success: false, jobsCount: 0, message: 'Ссылки на вакансии не найдены' };
        }

        // ШАГ 2: Для каждой вакансии получаем детальную информацию
        console.log(`\n🔍 Получение детальной информации для ${allVacanciesList.length} вакансий...\n`);

        for (let i = 0; i < allVacanciesList.length; i++) {
            const item = allVacanciesList[i];
            console.log(`   [${i + 1}/${allVacanciesList.length}] ${item.profession.substring(0, 40)}...`);

            const details = await this.detailsFetcher.fetch(item.id, item.companyCode);

            if (details) {
                this.allJobs.push(details);
                console.log(`      ✅ Добавлена вакансия: ${details.profession.substring(0, 50)}...`);
            } else {
                console.log(`      ⚠️ Не удалось получить детали`);
            }

            if (i < allVacanciesList.length - 1) {
                await this.detailsFetcher.delay();
            }
        }

        console.log(`\n📊 Всего получено деталей: ${this.allJobs.length} из ${allVacanciesList.length}`);

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