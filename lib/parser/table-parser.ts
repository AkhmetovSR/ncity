import { VacancyApiItem } from './fetcher';

export interface Vacancy {
    page: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
    busyType: string;
}

export class TableParser {
    private pageNum: number;

    constructor(pageNum: number) {
        this.pageNum = pageNum;
    }

    parseVacancies(apiItems: VacancyApiItem[]): Vacancy[] {
        if (!apiItems || apiItems.length === 0) {
            return [];
        }

        const vacancies: Vacancy[] = [];

        for (const item of apiItems) {
            // Формируем строку зарплаты
            let salaryText = this.formatSalaryText(item.salaryMin, item.salaryMax);

            // Форматируем дату
            const dateStr = this.formatDate(item.publishDate);

            // Определяем график работы
            const schedule = this.formatSchedule(item.scheduleType);

            // Определяем тип занятости
            const busyType = this.formatBusyType(item.busyType);

            if (item.profession && item.profession.length > 2) {
                vacancies.push({
                    page: this.pageNum,
                    profession: item.profession,
                    salary: salaryText,
                    district: item.regionName,
                    organization: item.organization,
                    date: dateStr,
                    schedule: schedule,
                    busyType: busyType
                });
            }
        }

        console.log(`   📊 На странице ${this.pageNum} найдено ${vacancies.length} вакансий`);
        return vacancies;
    }

    private formatSalaryText(min: number, max: number): string {
        if (min && max && min === max) {
            return `${min.toLocaleString('ru-RU')} руб.`;
        } else if (min && max) {
            return `${min.toLocaleString('ru-RU')} - ${max.toLocaleString('ru-RU')} руб.`;
        } else if (min && !max) {
            return `от ${min.toLocaleString('ru-RU')} руб.`;
        } else if (max && !min) {
            return `до ${max.toLocaleString('ru-RU')} руб.`;
        } else {
            return 'не указана';
        }
    }

    private formatDate(timestamp: number): string {
        if (!timestamp) return 'не указана';
        const date = new Date(timestamp);
        return date.toLocaleDateString('ru-RU');
    }

    private formatSchedule(scheduleType: string): string {
        const scheduleMap: Record<string, string> = {
            'FULL': 'Полный день',
            'PART_TIME': 'Неполный день',
            'TURN': 'Сменный график',
            'WATCH': 'Вахтовый метод',
            'FLOAT': 'Гибкий график',
            'IRREGULAR': 'Ненормированный день'
        };
        return scheduleMap[scheduleType] || scheduleType || 'не указан';
    }

    private formatBusyType(busyType: string): string {
        const busyMap: Record<string, string> = {
            'FULL': 'Полная занятость',
            'PART_TIME': 'Частичная занятость',
            'PROJECT': 'Проектная работа',
            'SEASONAL': 'Сезонная работа',
            'REMOTE': 'Удаленная работа',
            'PROBATION': 'Стажировка'
        };
        return busyMap[busyType] || busyType || 'не указан';
    }
}