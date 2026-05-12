import path from 'path';

export const config = {
    // Параметры сайта
    BASE_URL: 'https://ir-center.ru',
    VACANCY_PATH: '/sznregion/jobs/jobstab.asp',  // ← исправленный путь
    BASE_PARAMS: 'rn=%CD%FF%E3%E0%ED%FC&Region=86&Okato=141769',
    MAX_PAGES: 3,

    // Пути для хранения файлов
    DATA_DIR: process.env.VERCEL ? '/tmp/parser-data' : path.join(process.cwd(), 'data'),
    PAGES_DIR: process.env.VERCEL ? '/tmp/parser-pages' : path.join(process.cwd(), 'pages'),

    // Задержки между запросами
    MIN_DELAY_MS: 1500,
    MAX_DELAY_MS: 3500,

    // User-Agent для запросов
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',

    // Хранение страниц: удалять файлы старше N дней
    PAGES_MAX_AGE_DAYS: 3,  // 👈 Добавьте эту строку

    // Ожидаемые заголовки таблицы
    EXPECTED_HEADERS: [
        'Профессия',
        'Зарплата',
        'Район',
        'Организация/ источник вакансии',
        'Дата подтверждения',
        'График'
    ]
} as const;