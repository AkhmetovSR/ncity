// lib/config.ts
import path from 'path';

export const config = {
    // API сайта
    BASE_URL: 'https://trudvsem.ru',
    API_PATH: '/iblocks/_catalog/flat_filter_prr_search_vacancies/data',
    JOB_CARD_PATH: '/iblocks/job_card',

    // Параметры поиска
    TITLE: 'нягань',
    REGION_CODE: '8600000000000',

    // Пагинация
    MAX_PAGES: 1,      // Максимум страниц для парсинга
    PAGE_SIZE: 10,     // Вакансий на странице (максимум)
    START_PAGE: 0,

    // Лимиты
    MAX_VACANCIES_TO_PARSE: 500,  // Максимум вакансий для парсинга (поставьте нужное число)
    MAX_FILES_TO_KEEP: 3,         // Сколько файлов хранить в архиве

    // Путь для сохранения результатов
    DATA_DIR: process.env.VERCEL ? '/tmp/parser-data' : path.join(process.cwd(), 'data'),

    // Задержки между запросами (чтобы не забанили)
    MIN_DELAY_MS: 2000,
    MAX_DELAY_MS: 3000,

    // Заголовки для API (рабочие)
    HEADERS: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        'referer': 'https://trudvsem.ru/vacancy/search?_title=%D0%BD%D1%8F%D0%B3%D0%B0%D0%BD%D1%8C&_regionIds=8600000000000',
        'x-requested-with': 'XMLHttpRequest'
    }
};