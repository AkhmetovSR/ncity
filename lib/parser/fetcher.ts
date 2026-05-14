import { config } from '@/lib/config';
import { VacancyApiItem } from '@/types/vacancy';

export class Fetcher {
    // Получение списка вакансий с API по номеру страницы
    async fetchVacanciesList(pageNum: number): Promise<VacancyApiItem[]> {
        // Формируем фильтр: нужные профессии и регион
        const filter = {
            title: [config.TITLE],
            regionCode: [config.REGION_CODE]
        };
        // Формируем URL с параметрами
        const url = `${config.BASE_URL}${config.API_PATH}?filter=${encodeURIComponent(JSON.stringify(filter))}&orderColumn=RELEVANCE_DESC&page=${pageNum}&pageSize=${config.PAGE_SIZE}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: config.HEADERS
            });
            if (!response.ok) return [];
            const data = await response.json();
            if (!data?.result?.data) return [];
            return this.parseApiResponse(data);
        } catch (error: any) {
            return [];
        }
    }

    // Преобразование ответа API в нужный формат
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
    // Пауза между запросами (чтобы не нагружать сервер)
    async delay(): Promise<void> {
        const min = config.MIN_DELAY_MS;
        const max = config.MAX_DELAY_MS;
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}