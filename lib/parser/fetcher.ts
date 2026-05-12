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

export class Fetcher {
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