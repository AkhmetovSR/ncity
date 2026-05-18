import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class VacancyDetailsFetcher {
    async fetch(vacancyId: string, companyCode: string): Promise<Vacancy | null> {
        const url = `${config.BASE_URL}${config.JOB_CARD_PATH}?companyId=${companyCode}&vacancyId=${vacancyId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: config.HEADERS
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const v = data?.data?.vacancy;

            if (!v) return null;

            // Форматируем зарплату
            let salaryText = 'не указана';
            if (v.salaryMin && v.salaryMax && v.salaryMin === v.salaryMax) {
                salaryText = `${v.salaryMin.toLocaleString('ru-RU')} руб.`;
            } else if (v.salaryMin && v.salaryMax) {
                salaryText = `${v.salaryMin.toLocaleString('ru-RU')} - ${v.salaryMax.toLocaleString('ru-RU')} руб.`;
            } else if (v.salaryMin && !v.salaryMax) {
                salaryText = `от ${v.salaryMin.toLocaleString('ru-RU')} руб.`;
            } else if (v.salaryMax && !v.salaryMin) {
                salaryText = `до ${v.salaryMax.toLocaleString('ru-RU')} руб.`;
            }

            // Форматируем дату
            const date = new Date(v.publishedDate);
            const dateStr = date.toLocaleDateString('ru-RU');

            // График работы
            const scheduleMap: Record<string, string> = {
                'FULL': 'Полный день',
                'PART_TIME': 'Неполный день',
                'TURN': 'Сменный график',
                'WATCH': 'Вахтовый метод',
                'FLOAT': 'Гибкий график',
                'IRREGULAR': 'Ненормированный день'
            };
            const schedule = scheduleMap[v.scheduleType] || v.scheduleType || 'не указан';

            return {
                id: vacancyId,
                profession: v.vacancyName || '',
                salary: salaryText,
                district: v.stateRegion || '',
                organization: v.fullCompanyName || '',
                date: dateStr,
                schedule: schedule,
                busyType: v.busyType || 'не указан',
                description: v.positionResponsibilities || '',
                requirements: v.positionRequirements || '',
                address: v.fullAddress || '',
                phone: v.contacts?.['Телефон'] || '',
                email: v.contacts?.['Email'] || '',
                website: v.companyDTO?.site || '',
                experience: v.requiredExperience ? `от ${v.requiredExperience} лет` : 'не требуется',
                education: v.educationType || 'не указано',
                companyInn: v.companyDTO?.inn || '',
                companyOgrn: v.companyDTO?.ogrn || ''
            };

        } catch (error: any) {
            return null;
        }
    }

    async delay(): Promise<void> {
        const min = config.MIN_DELAY_MS;
        const max = config.MAX_DELAY_MS;
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}