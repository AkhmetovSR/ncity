import { config } from '@/lib/config';

export interface VacancyApiItem {
    id: string;
    profession: string;
    companyCode: string;
    organization: string;
    salaryMin: number;
    salaryMax: number;
    regionName: string;
    publishDate: number;
    scheduleType: string;
    busyType: string;
}

export interface VacancyDetails {
    id: string;
    profession: string;
    organization: string;
    companyCode: string;
    salaryMin: number;
    salaryMax: number;
    description: string;
    requirements: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    experience: number;
    education: string;
    scheduleType: string;
    busyType: string;
    publishDate: number;
    regionName: string;
    companyName: string;
    companyInn: string;
    companyOgrn: string;
    contactPerson: string;
    workPlaces: number;
    qualification: string;
}

export class Fetcher {
    // Получение списка вакансий (краткая информация)
    async fetchVacanciesList(pageNum: number): Promise<VacancyApiItem[]> {
        const filter = {
            title: [config.TITLE],
            regionCode: [config.REGION_CODE]
        };

        const url = `${config.BASE_URL}${config.API_PATH}?filter=${encodeURIComponent(JSON.stringify(filter))}&orderColumn=RELEVANCE_DESC&page=${pageNum}&pageSize=${config.PAGE_SIZE}`;

        console.log(`   🌐 Получение списка вакансий (страница ${pageNum})...`);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: config.HEADERS
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data?.result?.data) {
                return [];
            }

            return this.parseApiResponse(data);

        } catch (error: any) {
            console.log(`   ❌ Ошибка: ${error.message}`);
            return [];
        }
    }

    // Получение детальной информации о вакансии (ПРАВИЛЬНЫЙ URL!)
    async fetchVacancyDetails(vacancyId: string, companyCode: string): Promise<VacancyDetails | null> {
        const url = `${config.BASE_URL}/iblocks/job_card?companyId=${companyCode}&vacancyId=${vacancyId}`;

        console.log(`   🔍 Получение деталей: ${vacancyId.substring(0, 8)}...`);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: config.HEADERS
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Проверяем структуру ответа
            if (!data?.data?.vacancy) {
                console.log(`   ⚠️ Нет данных в ответе`);
                return null;
            }

            const vacancy = data.data.vacancy;

            return {
                id: vacancyId,
                profession: vacancy.vacancyName || '',
                organization: vacancy.fullCompanyName || '',
                companyCode: companyCode,
                salaryMin: vacancy.salaryMin || 0,
                salaryMax: vacancy.salaryMax || 0,
                description: vacancy.positionResponsibilities || '',
                requirements: vacancy.positionRequirements || '',
                address: vacancy.fullAddress || '',
                phone: vacancy.contacts?.['Телефон'] || vacancy.contactPersonPhone || '',
                email: vacancy.contacts?.['Email'] || '',
                website: vacancy.companyDTO?.site || '',
                experience: vacancy.requiredExperience || 0,
                education: vacancy.educationType || 'не указано',
                scheduleType: vacancy.scheduleType || '',
                busyType: vacancy.busyType || '',
                publishDate: vacancy.publishedDate || Date.now(),
                regionName: vacancy.stateRegion || '',
                companyName: vacancy.fullCompanyName || '',
                companyInn: vacancy.companyDTO?.inn || '',
                companyOgrn: vacancy.companyDTO?.ogrn || '',
                contactPerson: vacancy.contactPerson || '',
                workPlaces: vacancy.workPlaces || 0,
                qualification: vacancy.qualification || ''
            };

        } catch (error: any) {
            console.log(`   ❌ Ошибка получения деталей: ${error.message}`);
            return null;
        }
    }

    private parseApiResponse(data: any): VacancyApiItem[] {
        if (!data?.result?.data || !Array.isArray(data.result.data)) {
            return [];
        }

        return data.result.data.map((item: any[]) => ({
            id: item[0] || '',
            profession: item[1] || '',
            companyCode: item[2] || '',
            organization: item[3] || '',
            salaryMin: item[24] || 0,
            salaryMax: item[25] || 0,
            publishDate: item[26] || Date.now(),
            regionName: item[27] || '',
            scheduleType: item[22] || '',
            busyType: item[21] || ''
        }));
    }

    async delay(): Promise<void> {
        const min = config.MIN_DELAY_MS;
        const max = config.MAX_DELAY_MS;
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        console.log(`   ⏳ Пауза ${Math.round(delay / 1000)} сек...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}