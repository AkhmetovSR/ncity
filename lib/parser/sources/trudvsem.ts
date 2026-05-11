import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class TrudvsemParser {
    private cfg = config.trudvsem;

    // ============ ПУБЛИЧНЫЕ МЕТОДЫ ДЛЯ ТЕСТИРОВАНИЯ ============

    async fetchVacanciesList(pageNum: number): Promise<any[]> {
        const filter = {
            title: [this.cfg.TITLE],      // ← используем this.cfg.TITLE
            regionCode: [this.cfg.REGION_CODE]
        };

        const url = `${this.cfg.BASE_URL}${this.cfg.API_PATH}?filter=${encodeURIComponent(JSON.stringify(filter))}&orderColumn=RELEVANCE_DESC&page=${pageNum}&pageSize=${this.cfg.PAGE_SIZE}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.cfg.HEADERS
            });

            const data = await response.json();
            return data?.result?.data || [];

        } catch (error: any) {
            console.log(`   ❌ Ошибка: ${error.message}`);
            return [];
        }
    }

    async fetchVacancyDetails(vacancyId: string, companyCode: string): Promise<any | null> {
        const url = `${this.cfg.BASE_URL}/iblocks/job_card?companyId=${companyCode}&vacancyId=${vacancyId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.cfg.HEADERS
            });

            const data = await response.json();
            return data?.data?.vacancy || null;

        } catch (error: any) {
            console.log(`   ❌ Ошибка: ${error.message}`);
            return null;
        }
    }

    formatSalary(min: number, max: number): string {
        if (min && max && min === max) return `${min.toLocaleString('ru-RU')} руб.`;
        if (min && max) return `${min.toLocaleString('ru-RU')} - ${max.toLocaleString('ru-RU')} руб.`;
        if (min && !max) return `от ${min.toLocaleString('ru-RU')} руб.`;
        if (max && !min) return `до ${max.toLocaleString('ru-RU')} руб.`;
        return 'не указана';
    }

    formatSchedule(scheduleType: string): string {
        const map: Record<string, string> = {
            'FULL': 'Полный день',
            'PART_TIME': 'Неполный день',
            'TURN': 'Сменный график',
            'WATCH': 'Вахтовый метод',
            'FLOAT': 'Гибкий график',
            'IRREGULAR': 'Ненормированный день'
        };
        return map[scheduleType] || scheduleType || 'не указан';
    }

    // ============ ОСНОВНОЙ МЕТОД ПАРСИНГА ============

    async parseJobs(): Promise<Vacancy[]> {
        const allVacancies: Vacancy[] = [];
        const allIds: { id: string; companyCode: string; profession: string }[] = [];

        for (let page = this.cfg.START_PAGE; page < this.cfg.MAX_PAGES; page++) {
            console.log(`   📄 Страница ${page}...`);
            const items = await this.fetchVacanciesList(page);

            if (!items || items.length === 0) break;

            for (const item of items) {
                allIds.push({
                    id: item[0],
                    companyCode: item[2],
                    profession: item[1]
                });
            }

            console.log(`      Найдено ${items.length} вакансий`);
            await this.delay();
        }

        console.log(`   📊 Всего ID: ${allIds.length}`);

        for (let i = 0; i < allIds.length; i++) {
            const item = allIds[i];
            console.log(`   🔍 [${i + 1}/${allIds.length}] ${item.profession.substring(0, 40)}...`);

            const details = await this.fetchVacancyDetails(item.id, item.companyCode);

            if (details) {
                allVacancies.push({
                    source: this.cfg.source,
                    id: item.id,
                    page: i + 1,
                    profession: details.vacancyName || item.profession,
                    salary: this.formatSalary(details.salaryMin, details.salaryMax),
                    district: details.stateRegion || '',
                    organization: details.fullCompanyName || '',
                    date: new Date(details.publishedDate).toLocaleDateString('ru-RU'),
                    schedule: this.formatSchedule(details.scheduleType),
                    busyType: details.busyType || 'не указан',
                    description: details.positionResponsibilities || '',
                    requirements: details.positionRequirements || '',
                    address: details.fullAddress || '',
                    phone: details.contacts?.['Телефон'] || '',
                    email: details.contacts?.['Email'] || '',
                    website: details.companyDTO?.site || '',
                    experience: details.requiredExperience ? `от ${details.requiredExperience} лет` : 'не требуется',
                    education: details.educationType || 'не указано',
                    contactPerson: details.contactPerson || '',
                    workPlaces: details.workPlaces || 0
                });
            }

            await this.delay();
        }

        return allVacancies;
    }

    private async delay(): Promise<void> {
        const min = config.MIN_DELAY_MS;
        const max = config.MAX_DELAY_MS;
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        console.log(`      ⏳ Пауза ${Math.round(delay / 1000)} сек...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}