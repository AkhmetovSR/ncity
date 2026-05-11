import path from 'path';

// Общие настройки
export const config = {
    // Путь для сохранения результатов
    DATA_DIR: process.env.VERCEL ? '/tmp/parser-data' : path.join(process.cwd(), 'data'),

    // Задержки между запросами (общие)
    MIN_DELAY_MS: 1500,
    MAX_DELAY_MS: 3000,

    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',

    // Источник 1: trudvsem.ru
    trudvsem: {
        source: 'trudvsem.ru',
        BASE_URL: 'https://trudvsem.ru',
        API_PATH: '/iblocks/_catalog/flat_filter_prr_search_vacancies/data',
        JOB_CARD_PATH: '/iblocks/job_card',
        TITLE: 'нягань',
        REGION_CODE: '8600000000000',
        MAX_PAGES: 6,
        PAGE_SIZE: 10,
        START_PAGE: 0,
        HEADERS: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'referer': 'https://trudvsem.ru/vacancy/search?_title=%D0%BD%D1%8F%D0%B3%D0%B0%D0%BD%D1%8C&_regionIds=8600000000000',
            'x-requested-with': 'XMLHttpRequest'
        }
    },

    // Источник 2: ir-center.ru
    irCenter: {
        source: 'ir-center.ru',
        BASE_URL: 'https://ir-center.ru',
        VACANCY_PATH: '/sznregion/dsktop/czninfo.asp',
        BASE_PARAMS: 'rn=%E3%20%CD%FF%E3%E0%ED%FC&rg=86&Profession=&sort=',
        MAX_PAGES: 10,
        TITLE: 'Нягань',
        MIN_DELAY_MS: 1500,
        MAX_DELAY_MS: 3500,
        USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
};