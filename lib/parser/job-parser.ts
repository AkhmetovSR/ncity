import { Fetcher, VacancyDetails } from './fetcher';
import { Storage } from './storage';
import { config } from '@/lib/config';

export interface Vacancy {
    id: string;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
    busyType: string;
    description: string;
    requirements: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    experience: string;
    education: string;
    companyInn: string;
    companyOgrn: string;
}

export class JobParser {
    private fetcher: Fetcher;
    private storage: Storage;
    public allJobs: Vacancy[] = [];

    constructor() {
        this.fetcher = new Fetcher();
        this.storage = new Storage();
    }

    async parseJobs(): Promise<{ success: boolean; jobsCount: number; message?: string }> {
        console.log(`🚀 Запуск парсера (полная информация о вакансиях)`);
        console.log(`🔍 Поиск: "${config.TITLE}" в регионе ${config.REGION_CODE}`);
        console.log(`⚠️ Внимание: будет выполнено ~60 запросов за ~2-3 минуты\n`);

        const allVacanciesList: VacancyApiItem[] = [];

        // ШАГ 1: Получаем ID всех вакансий со всех страниц
        console.log(`📋 ШАГ 1: Получение списка ID вакансий\n`);

        for (let page = config.START_PAGE; page < config.MAX_PAGES; page++) {
            console.log(`📄 Страница ${page}`);

            const items = await this.fetcher.fetchVacanciesList(page);

            if (!items || items.length === 0) {
                console.log(`🏁 Страница ${page} пуста, завершаем`);
                break;
            }

            allVacanciesList.push(...items);
            console.log(`   ✅ Добавлено ${items.length} ID (всего: ${allVacanciesList.length})`);

            if (page < config.MAX_PAGES - 1) {
                await this.fetcher.delay();
            }
        }

        console.log(`\n📊 Найдено ${allVacanciesList.length} вакансий\n`);

        // ШАГ 2: Получаем детальную информацию для каждой вакансии
        console.log(`📋 ШАГ 2: Получение детальной информации (${allVacanciesList.length} вакансий)\n`);

        let processed = 0;
        let failed = 0;

        for (const item of allVacanciesList) {
            processed++;
            console.log(`\n📌 Вакансия ${processed}/${allVacanciesList.length}: ${item.profession.substring(0, 50)}...`);

            const details = await this.fetcher.fetchVacancyDetails(item.id, item.companyCode);

            if (details) {
                // Форматируем зарплату
                let salaryText = 'не указана';
                if (details.salaryMin && details.salaryMax && details.salaryMin === details.salaryMax) {
                    salaryText = `${details.salaryMin.toLocaleString('ru-RU')} руб.`;
                } else if (details.salaryMin && details.salaryMax) {
                    salaryText = `${details.salaryMin.toLocaleString('ru-RU')} - ${details.salaryMax.toLocaleString('ru-RU')} руб.`;
                } else if (details.salaryMin && !details.salaryMax) {
                    salaryText = `от ${details.salaryMin.toLocaleString('ru-RU')} руб.`;
                } else if (details.salaryMax && !details.salaryMin) {
                    salaryText = `до ${details.salaryMax.toLocaleString('ru-RU')} руб.`;
                }

                // Форматируем дату
                const date = new Date(details.publishDate);
                const dateStr = date.toLocaleDateString('ru-RU');

                // Определяем график работы
                const scheduleMap: Record<string, string> = {
                    'FULL': 'Полный день',
                    'PART_TIME': 'Неполный день',
                    'TURN': 'Сменный график',
                    'WATCH': 'Вахтовый метод',
                    'FLOAT': 'Гибкий график',
                    'IRREGULAR': 'Ненормированный день'
                };
                const schedule = scheduleMap[details.scheduleType] || details.scheduleType || 'не указан';

                // Определяем тип занятости
                const busyMap: Record<string, string> = {
                    'FULL': 'Полная занятость',
                    'PART_TIME': 'Частичная занятость',
                    'PROJECT': 'Проектная работа',
                    'SEASONAL': 'Сезонная работа',
                    'REMOTE': 'Удаленная работа',
                    'PROBATION': 'Стажировка'
                };
                const busyType = busyMap[details.busyType] || details.busyType || 'не указан';

                // Опыт работы
                let experienceText = 'не требуется';
                if (details.experience > 0) {
                    experienceText = `от ${details.experience} лет`;
                }

                this.allJobs.push({
                    id: details.id,
                    profession: details.profession,
                    salary: salaryText,
                    district: details.regionName,
                    organization: details.organization,
                    date: dateStr,
                    schedule: schedule,
                    busyType: busyType,
                    description: details.description || 'Нет описания',
                    requirements: details.requirements || 'Не указаны',
                    address: details.address || 'Не указан',
                    phone: details.phone || 'Не указан',
                    email: details.email || 'Не указан',
                    website: details.website || 'Не указан',
                    experience: experienceText,
                    education: details.education,
                    companyInn: details.companyInn,
                    companyOgrn: details.companyOgrn
                });

                console.log(`   ✅ Добавлена: ${details.profession.substring(0, 40)}...`);
            } else {
                failed++;
                console.log(`   ❌ Не удалось получить детали`);
            }

            // Задержка между запросами деталей
            if (processed < allVacanciesList.length) {
                await this.fetcher.delay();
            }
        }

        console.log(`\n📊 Результат:`);
        console.log(`   ✅ Успешно: ${this.allJobs.length}`);
        console.log(`   ❌ Ошибок: ${failed}`);

        if (this.allJobs.length > 0) {
            await this.storage.saveResults(this.allJobs);
            this.showStats();
            return {
                success: true,
                jobsCount: this.allJobs.length,
                message: `Собрано ${this.allJobs.length} вакансий с полной информацией`
            };
        }

        return { success: false, jobsCount: 0, message: 'Вакансии не найдены' };
    }

    private showStats(): void {
        const unique = new Set(this.allJobs.map(j => j.profession));
        console.log(`\n📊 ИТОГО: вакансий ${this.allJobs.length}, уникальных профессий ${unique.size}`);
    }
}