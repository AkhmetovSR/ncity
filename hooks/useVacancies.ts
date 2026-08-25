// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Page } from '@/types/vacancy';
//
// // Строгая типизация системных ошибок UI для безопасной обработки на фронтенде
// type FetchError = {
//     type: 'network' | 'server';
//     message: string;
// } | null;
//
// /**
//  * Парсит строковую дату формата "ДД.ММ.ГГГГ" в объект Date.
//  * Вынесена за пределы компонента, так как является чистой функцией
//  * и не требует пересоздания при каждом рендере (оптимизация памяти).
//  */
// const parseDate = (dateStr: string): Date => {
//     if (!dateStr) return new Date();
//     const [day, month, year] = dateStr.split('.');
//     // Месяцы в JS начинаются с 0, поэтому вычитаем 1
//     return new Date(Number(year), Number(month) - 1, Number(day));
// };
//
// /**
//  * Предотвращает падение сортировки, если зарплата не указана.
//  * Возвращает 0 в качестве дефолтного значения для корректного математического сравнения.
//  */
// const parseSalary = (salary: number | null | undefined): number => {
//     return salary ?? 0;
// };
//
// /**
//  * Custom Hook: Изолирует всю бизнес-логику управления вакансиями.
//  * Реализует паттерны: Разделение ответственности (SoC), отмену race conditions и кэш-контроль.
//  */
// export function useVacancies() {
//     // Хранилище сырых данных, полученных с бэкенда
//     const [vacancies, setVacancies] = useState<Page[]>([]);
//     // Флаг состояния загрузки для отображения скелетонов/лоадеров
//     const [loading, setLoading] = useState(true);
//     // Типизированный стейт ошибки (сеть или сбой сервера)
//     const [error, setError] = useState<FetchError>(null);
//     // Стейт текущей сортировки (по умолчанию: от новых к старым)
//     const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');
//
//     /**
//      * Стабильная функция запроса данных. Обернута в useCallback,
//      * чтобы ссылка на неё не менялась при рендерах, предотвращая бесконечные циклы в useEffect.
//      * Принимает AbortSignal для принудительной отмены подвисших запросов.
//      */
//     const fetchVacancies = useCallback(async (signal: AbortSignal) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await fetch('/api/vacancies', { signal });
//
//             // Если сервер ответил ошибкой (например, 500 или 404), генерируем исключение
//             if (!res.ok) throw new Error(`Server status ${res.status}`);
//
//             const data: Page[] = await res.json();
//             setVacancies(data);
//         } catch (err) {
//             // Если запрос отменен через AbortController, прерываем выполнение.
//             // Это предотвращает race conditions, когда старый медленный запрос перезаписывает новый.
//             if (err instanceof Error && err.name === 'AbortError') return;
//
//             console.error('Ошибка загрузки вакансий:', err);
//
//             // Дифференцируем ошибку: проверяем физический онлайн-статус браузера пользователя
//             if (!navigator.onLine) {
//                 setError({
//                     type: 'network',
//                     message: 'Проверьте подключение к интернету и повторите попытку.'
//                 });
//             } else {
//                 setError({
//                     type: 'server',
//                     message: 'Не удалось загрузить данные. Сервер временно недоступен.'
//                 });
//             }
//         } finally {
//             // Блок выполняется всегда, гарантируя скрытие лоадера в любом исходе
//             setLoading(false);
//         }
//     }, []);
//
//     /**
//      * Эффект первичного монтирования. Запускает сетевой запрос.
//      * Функция очистки (cleanup) автоматически отменяет запрос, если пользователь ушел со страницы.
//      */
//     useEffect(() => {
//         const controller = new AbortController();
//         // Явно сообщаем компилятору, что Promise контролируется внутри самой функции
//         void fetchVacancies(controller.signal);
//
//         return () => controller.abort();
//     }, [fetchVacancies]);
//
//     /**
//      * Публичный метод для ручного повтора запроса при сбоях (Паттерн "Retry Pattern")
//      */
//     const handleRetry = () => {
//         const controller = new AbortController();
//         void fetchVacancies(controller.signal);
//     };
//
//     /**
//      * Оптимизация: Сортировка массива на лету (On-the-fly Sorting).
//      * useMemo предотвращает повторную сортировку при любых перерендерах UI (например, при открытии модалки).
//      * Сортировка сработает ТОЛЬКО если изменился массив вакансий или тип сортировки.
//      */
//     const processedVacancies = useMemo(() => {
//         const sorted = [...vacancies]; // Создаем копию, так как .sort() мутирует исходный массив
//         switch (sortBy) {
//             case 'date':
//                 return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
//             // case 'salary-asc':
//             //     return sorted.sort((a, b) => parseSalary(a.date) - parseSalary(b.salary));
//             // case 'salary-desc':
//             //     return sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
//             default:
//                 return sorted;
//         }
//     }, [vacancies, sortBy]);
//
//     // Возвращаем строго контролируемый интерфейс наружу для использования в JSX компонентах
//     return {
//         vacancies: processedVacancies,
//         loading,
//         error,
//         sortBy,
//         setSortBy,
//         handleRetry
//     };
// }

// --------------------- VERCEL-------------------------------------------------------
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vacancy } from '@/types/vacancy';

// Строгая типизация системных ошибок UI
type FetchError = {
    type: 'network' | 'server';
    message: string;
} | null;

// Временный массив вакансий для успешного деплоя на Vercel без БД
const MOCK_VACANCIES: Vacancy[] = [
    {
        id: '1',
        profession: 'Frontend Разработчик (React)',
        salary: '150000',
        district: 'Центральный район',
        organization: 'ТехноСфера ИТ',
        date: '10.08.2026',
        schedule: 'Удаленная работа',
        busyType: 'Полная занятость',
        description: 'Разработка интерфейсов крупных корпоративных приложений на Next.js и TypeScript.',
        requirements: 'Опыт работы с React от 2 лет, знание TailwindCSS, Redux Toolkit.'
    },
    {
        id: '2',
        profession: 'Backend Разработчик (Node.js)',
        salary: '180000',
        district: 'Приморский район',
        organization: 'Диджитал Лаб',
        date: '09.08.2026',
        schedule: 'Полный день',
        busyType: 'Полная занятость',
        description: 'Проектирование и поддержка высоконагруженных API сервисов.',
        requirements: 'Node.js, Express/NestJS, PostgreSQL, Redis, Docker.'
    },
    {
        id: '3',
        profession: 'UI/UX Дизайнер',
        salary: '95000',
        district: 'Выборгский район',
        organization: 'Креатив Студио',
        date: '08.08.2026',
        schedule: 'Гибкий график',
        busyType: 'Частичная занятость',
        description: 'Создание адаптивных макетных сеток, прототипирование пользовательских путей.',
        requirements: 'Figma, Adobe CC, портфолио мобильных и веб-интерфейсов.'
    },
    {
        id: '4',
        profession: 'QA Automation Engineer',
        salary: '140000',
        district: 'Удаленно',
        organization: 'ТестМастерс',
        date: '07.08.2026',
        schedule: 'Удаленная работа',
        busyType: 'Полная занятость',
        description: 'Автоматизация тестирования веб и мобильных платформ.',
        requirements: 'Python/JS, Playwright, Selenium, CI/CD процессы.'
    },
    {
        id: '5',
        profession: 'Project Manager',
        salary: '120000',
        district: 'Московский район',
        organization: 'Стартап Сити',
        date: '06.08.2026',
        schedule: 'Полный день',
        busyType: 'Полная занятость',
        description: 'Управление кросс-функциональной командой разработки программного обеспечения.',
        requirements: 'Agile/Scrum, Jira, опыт ведения ИТ-проектов от 1 года.'
    },
    {
        id: '6',
        profession: 'DevOps Инженер',
        salary: '210000',
        district: 'Удаленно',
        organization: 'Клауд Системс',
        date: '05.08.2026',
        schedule: 'Удаленная работа',
        busyType: 'Полная занятость',
        description: 'Поддержка и масштабирование облачной инфраструктуры проекта.',
        requirements: 'Kubernetes, Terraform, AWS, GitLab CI, Linux.'
    },
    {
        id: '7',
        profession: 'Аналитик данных (Data Analyst)',
        salary: '110000',
        district: 'Красногвардейский район',
        organization: 'ДатаИнк',
        date: '04.08.2026',
        schedule: 'Гибкий график',
        busyType: 'Полная занятость',
        description: 'Построение дашбордов, анализ продуктовых метрик и пользовательского поведения.',
        requirements: 'SQL, Python (Pandas/NumPy), Tableau/PowerBI.'
    },
    {
        id: '8',
        profession: 'Content Manager',
        salary: '60000',
        district: 'Невский район',
        organization: 'МедиаГрупп',
        date: '03.08.2026',
        schedule: 'Полный день',
        busyType: 'Полная занятость',
        description: 'Наполнение каталогов сайтов текстовым и графическим контентом.',
        requirements: 'Грамотный русский язык, базовый HTML, базовые навыки Photoshop.'
    },
    {
        id: '9',
        profession: 'Системный администратор',
        salary: '85000',
        district: 'Кировский район',
        organization: 'ПромТех',
        date: '02.08.2026',
        schedule: 'Полный день',
        busyType: 'Полная занятость',
        description: 'Обслуживание парка ПК организации, серверов 1С и сетевого оборудования.',
        requirements: 'Windows Server, Active Directory, понимание принципов работы сетей TCP/IP.'
    },
    {
        id: '10',
        profession: 'Стажер Frontend разработчик',
        salary: '40000',
        district: 'Центральный район',
        organization: 'ТехноСфера ИТ',
        date: '01.08.2026',
        schedule: 'Гибкий график',
        busyType: 'Стажировка',
        description: 'Помощь команде в верстке простых компонентов и написании юнит-тестов.',
        requirements: 'Знание HTML/CSS/Базовый JS, готовность учиться 30 часов в неделю.'
    }
];

const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('.');
    return new Date(Number(year), Number(month) - 1, Number(day));
};

const parseSalary = (salaryStr: string | null | undefined): number => {
    if (!salaryStr) return 0;
    const parsed = parseInt(salaryStr.replace(/\s/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
};

export function useVacancies() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<FetchError>(null);
    const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');

    const fetchVacancies = useCallback(async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            // Имитация задержки сети 700мс для проверки UI-скелетонов
            await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(resolve, 700);
                signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    reject(new DOMException('Aborted', 'AbortError'));
                });
            });

            // Заполняем стейт локальным массивом вместо fetch
            setVacancies(MOCK_VACANCIES);

        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;

            console.error('Ошибка загрузки вакансий:', err);
            if (!navigator.onLine) {
                setError({
                    type: 'network',
                    message: 'Проверьте подключение к интернету.'
                });
            } else {
                setError({
                    type: 'server',
                    message: 'Не удалось загрузить данные. Сервер недоступен.'
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void fetchVacancies(controller.signal);

        return () => controller.abort();
    }, [fetchVacancies]);

    const handleRetry = () => {
        const controller = new AbortController();
        void fetchVacancies(controller.signal);
    };

    const processedVacancies = useMemo(() => {
        const sorted = [...vacancies];
        switch (sortBy) {
            case 'date':
                return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
            case 'salary-asc':
                return sorted.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
            case 'salary-desc':
                return sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
            default:
                return sorted;
        }
    }, [vacancies, sortBy]);

    return {
        vacancies: processedVacancies,
        loading,
        error,
        sortBy,
        setSortBy,
        handleRetry
    };
}
