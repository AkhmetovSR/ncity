const path = require('path');

module.exports = {
    BASE_URL: 'https://ir-center.ru',
    VACANCY_PATH: '/sznregion/dsktop/czninfo.asp',
    BASE_PARAMS: 'rn=%E3%20%CD%FF%E3%E0%ED%FC&rg=86&Profession=&sort=',
    MAX_PAGES: 10,

    // На Vercel используем /tmp, локально — папку в проекте
    DATA_DIR: process.env.VERCEL ? '/tmp/parser-data' : path.join(process.cwd(), 'data'),
    PAGES_DIR: process.env.VERCEL ? '/tmp/parser-pages' : path.join(process.cwd(), 'pages'),

    REQUEST_DELAY_MS: 1500,
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',

    EXPECTED_HEADERS: [
        'Профессия',
        'Зарплата',
        'Район',
        'Организация/ источник вакансии',
        'Дата подтверждения',
        'График'
    ]
};