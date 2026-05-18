// lib/JobParser.ts
import { Fetcher } from './fetcher';
import { VacancyDetailsFetcher } from '@/lib/parser/vacancyDetailsFetcher';
import { Storage } from './storage';
import { config } from '@/lib/config';
import { Vacancy, VacancyApiItem } from '@/types/vacancy';
import { logger } from '@/lib/logger/logger'; // Добавляем логгер

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
        await logger.info('Начало парсинга вакансий', 'parser');

        // ШАГ 1: Получаем список ID вакансий
        const allVacanciesList: VacancyApiItem[] = [];

        await logger.info(`Начинаем сбор ссылок на вакансии. Страницы: ${config.START_PAGE} - ${config.MAX_PAGES}`, 'parser');

        for (let page = config.START_PAGE; page < config.MAX_PAGES; page++) {
            try {
                const items = await this.fetcher.fetchVacanciesList(page);

                if (!items || items.length === 0) {
                    await logger.warning(`На странице ${page} нет вакансий`, 'parser');
                    break;
                }

                await logger.info(`Страница ${page}: найдено ${items.length} вакансий`, 'parser');

                // Добавляем только до лимита
                const remaining = config.MAX_VACANCIES_TO_PARSE - allVacanciesList.length;
                const toAdd = items.slice(0, remaining);
                allVacanciesList.push(...toAdd);

                await logger.info(`Всего собрано ссылок: ${allVacanciesList.length} из ${config.MAX_VACANCIES_TO_PARSE}`, 'parser');

                if (allVacanciesList.length >= config.MAX_VACANCIES_TO_PARSE) {
                    await logger.info('Достигнут лимит вакансий для парсинга', 'parser');
                    break;
                }

                await this.fetcher.delay();
            } catch (error) {
                await logger.error(`Ошибка при получении страницы ${page}`, 'parser', error);
            }
        }

        if (allVacanciesList.length === 0) {
            await logger.error('Ссылки на вакансии не найдены', 'parser');
            return { success: false, jobsCount: 0, message: 'Ссылки на вакансии не найдены' };
        }

        await logger.info(`Начинаем парсинг детальной информации для ${allVacanciesList.length} вакансий`, 'parser');

        // ШАГ 2: Для каждой вакансии получаем детальную информацию
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < allVacanciesList.length; i++) {
            const item = allVacanciesList[i];

            try {
                const details = await this.detailsFetcher.fetch(item.id, item.companyCode);

                if (details) {
                    this.allJobs.push(details);
                    successCount++;

                    // Логируем каждые 10 успешных парсингов
                    if (successCount % 10 === 0) {
                        await logger.info(`Прогресс: спарсено ${successCount} из ${allVacanciesList.length} вакансий`, 'parser');
                    }
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
                await logger.error(`Ошибка при парсинге вакансии ${item.id}`, 'parser', error);
            }

            if (i < allVacanciesList.length - 1) {
                await this.detailsFetcher.delay();
            }
        }

        await logger.info(`Парсинг завершен. Успешно: ${successCount}, Ошибок: ${errorCount}`, 'parser');

        // ШАГ 3: Сохраняем результат
        if (this.allJobs.length > 0) {
            await logger.success(`Сохранение ${this.allJobs.length} вакансий в файл`, 'parser');
            await this.storage.saveResults(this.allJobs);
            await logger.success(`Парсинг успешно завершен! Сохранено ${this.allJobs.length} вакансий`, 'parser');

            return {
                success: true,
                jobsCount: this.allJobs.length,
                message: `Собрано ${this.allJobs.length} вакансий`
            };
        }

        await logger.error('Вакансии не найдены после парсинга', 'parser');
        return { success: false, jobsCount: 0, message: 'Вакансии не найдены' };
    }
}