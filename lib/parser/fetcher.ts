// lib/fetcher.ts
import { config } from '@/lib/config';
import { VacancyApiItem } from '@/types/vacancy';

// Тип для ответа API
interface ApiResponse {
    result: {
        data: Array<unknown[]>; // массив массивов с данными вакансий
    };
}

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

            const data = await response.json() as ApiResponse;

            if (!data?.result?.data) return [];

            return this.parseApiResponse(data);
        } catch (error) {
            console.error('Ошибка при загрузке вакансий:', error);
            return [];
        }
    }

    // Преобразование ответа API в нужный формат
    private parseApiResponse(data: ApiResponse): VacancyApiItem[] {
        if (!data?.result?.data || !Array.isArray(data.result.data)) {
            return [];
        }

        return data.result.data.map((item) => ({
            id: String(item[0] || ''),
            profession: String(item[1] || ''),
            companyCode: String(item[2] || ''),
            organization: String(item[3] || ''),
            salaryMin: Number(item[24]) || 0,
            salaryMax: Number(item[25]) || 0,
            publishDate: Number(item[26]) || Date.now(),
            regionName: String(item[27] || ''),
            scheduleType: String(item[22] || ''),
            busyType: String(item[21] || '')
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