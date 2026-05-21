'use client';
import s from './VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from "react";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
// Импортируем тип Vacancy для TypeScript (описывает структуру данных вакансии)
import { Vacancy } from '@/types/vacancy';

export default function VacancyList() {
    // === СОСТОЯНИЯ ===

    // Массив всех вакансий, загруженных с сервера
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);

    // Отфильтрованные/отсортированные вакансии (показываются пользователю)
    const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);

    // Флаг загрузки: true пока данные не пришли с сервера
    const [loading, setLoading] = useState(true);

    // Флаг открытия модального окна с деталями вакансии
    const [vacancyOpen, setVacancyOpen] = useState(false);

    // Выбранная вакансия для показа в модальном окне
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

    // Тема оформления: 'dark' (тёмная) или 'light' (светлая)
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Тип сортировки: по дате, по зарплате (возрастание/убывание)
    const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');

    // Множество индексов карточек, которые уже видны в области просмотра
    // Используем Set для быстрой проверки наличия индекса (O(1) вместо O(n))
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

    // === REFS (ссылки на DOM элементы) ===

    // Ref для Intersection Observer - позволяет отслеживать появление элементов в области просмотра
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Массив ref-ссылок на карточки вакансий для отслеживания их видимости
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

    /**
     * Парсит строку с датой в формате "DD.MM.YYYY" в объект Date
     * @param dateStr - строка даты, например "25.12.2024"
     * @returns объект Date
     */
    function parseDate(dateStr: string): Date {
        // Разбиваем строку по точке: ["25", "12", "2024"]
        const [day, month, year] = dateStr.split('.');
        // Создаём объект Date (месяц начинается с 0, поэтому вычитаем 1)
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    /**
     * Парсит строку с зарплатой и возвращает среднее число
     * @param salaryStr - строка зарплаты, например "100 000 - 150 000 ₽" или "от 50 000 ₽"
     * @returns среднее значение зарплаты в числах
     */
    function parseSalary(salaryStr: string): number {
        // Находим все числа в строке с помощью регулярного выражения
        const numbers = salaryStr.match(/\d+/g);
        // Если чисел нет, возвращаем 0
        if (!numbers) return 0;
        // Преобразуем строки в числа
        const nums = numbers.map(Number);
        // Возвращаем среднее арифметическое
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    /**
     * Сортирует массив вакансий в зависимости от выбранного типа сортировки
     * useCallback мемоизирует функцию, чтобы она не пересоздавалась при каждом рендере
     */
    const sortVacancies = useCallback((vacanciesList: Vacancy[]) => {
        // Создаём копию массива, чтобы не мутировать оригинал
        const sorted = [...vacanciesList];

        // Выбираем способ сортировки
        switch (sortBy) {
            case 'date':
                // Сортировка по дате: новые сверху (b - a)
                return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
            case 'salary-asc':
                // Сортировка по зарплате: от меньшей к большей
                return sorted.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
            case 'salary-desc':
                // Сортировка по зарплате: от большей к меньшей
                return sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
            default:
                return sorted;
        }
    }, [sortBy]); // Зависимость: пересоздаётся только когда меняется sortBy

    // === ЭФФЕКТЫ (useEffect) ===

    /**
     * Эффект загрузки темы из localStorage при монтировании компонента
     * Выполняется один раз при первой загрузке
     */
    useEffect(() => {
        // Пытаемся получить сохранённую тему из localStorage
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        // Устанавливаем тему в состояние
        setTheme(savedTheme);
        // Устанавливаем атрибут data-theme на корневом элементе HTML
        // Это позволит глобальному CSS применять правильные переменные
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []); // Пустой массив зависимостей = эффект выполняется один раз

    /**
     * Эффект загрузки вакансий с сервера
     */
    useEffect(() => {
        // Отправляем GET запрос к API эндпоинту /api/vacancies
        fetch('/api/vacancies')
            .then(res => res.json()) // Преобразуем ответ в JSON
            .then((data: Vacancy[]) => {
                // Сортируем полученные данные
                const sortedData = sortVacancies(data);
                // Сохраняем в состояние
                setVacancies(sortedData);
                setFilteredVacancies(sortedData);
                // Выключаем флаг загрузки
                setLoading(false);
            })
            .catch(() => setLoading(false)); // В случае ошибки тоже выключаем загрузку
    }, []); // Пустой массив - загружаем один раз при монтировании

    /**
     * Эффект применяет сортировку каждый раз, когда меняется тип сортировки
     * или обновляется список вакансий
     */
    useEffect(() => {
        if (vacancies.length > 0) {
            setFilteredVacancies(sortVacancies(vacancies));
        }
    }, [sortBy, vacancies]); // Зависимости: sortBy и vacancies

    /**
     * Эффект настройки Intersection Observer для анимации появления карточек при скролле
     * Observer отслеживает, когда карточка попадает в область просмотра
     */
    // useEffect(() => {
    //     // Создаём новый Intersection Observer
    //     observerRef.current = new IntersectionObserver(
    //         (entries) => {
    //             // Для каждой отслеживаемой карточки
    //             entries.forEach((entry) => {
    //                 // Если карточка появилась в области просмотра
    //                 if (entry.isIntersecting) {
    //                     // Получаем индекс из атрибута data-index
    //                     const index = Number(entry.target.getAttribute('data-index'));
    //                     // Добавляем индекс в Set видимых карточек
    //                     setVisibleCards(prev => new Set(prev).add(index));
    //                     // Прекращаем отслеживать эту карточку (анимация уже показана)
    //                     observerRef.current?.unobserve(entry.target);
    //                 }
    //             });
    //         },
    //         {
    //             threshold: 0.1,    // Карточка считается видимой, когда 10% её площади в области просмотра
    //             rootMargin: '50px' // Добавляем отступ в 50px - анимация сработает чуть раньше
    //         }
    //     );
    //
    //     // Подключаем каждую карточку к Observer
    //     cardsRef.current.forEach((card) => {
    //         if (card) observerRef.current?.observe(card);
    //     });
    //
    //     // Очистка: отключаем Observer при размонтировании компонента
    //     return () => observerRef.current?.disconnect();
    // }, [filteredVacancies]); // Пересоздаём Observer, когда меняется список вакансий

    // === UI: СКЕЛЕТОН-ЗАГРУЗКА ===
    // Показывается, пока данные загружаются
    // if (loading) {
    //     return (
    //         <motion.div className={s.fullscreenOverlay} layoutId="vacancy" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3}} exit={{opacity: 0}}>
    //             <motion.div className={s.fullscreenContent} onClick={(e) => e.stopPropagation()}>
    //                 {/* Хедер с переключателем темы и кнопкой закрытия */}
    //                 <div className={s.header}>
    //                     <div className={s.stats}></div>
    //                     <button onClick={toggleTheme} className={s.themeToggle}>
    //                         <span className={s.themeIcon}>{theme === 'dark' ? '☀️' : '🌙'}</span>
    //                     </button>
    //                     <Link href="/" className={s.closeButton}>✕</Link>
    //                 </div>
    //
    //                 {/* Контейнер скелетонов - 5 анимированных заглушек */}
    //                 <motion.div className={s.skeletonContainer} initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
    //                     {[1, 2, 3, 4, 5].map((i) => (
    //                         <div key={i} className={s.skeletonCard}>
    //                             <div className={s.skeletonRow} style={{width: '70%'}}></div>
    //                             <div className={s.skeletonRowSmall}></div>
    //                             <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16}}>
    //                                 <div className={s.skeletonButton}></div>
    //                                 <div className={s.skeletonRowSmall} style={{width: 80}}></div>
    //                             </div>
    //                         </div>
    //                     ))}
    //                 </motion.div>
    //             </motion.div>
    //         </motion.div>
    //     );
    // }

    // === UI: ПУСТОЙ СОСТОЯНИЕ ===
    // Показывается, если вакансий нет
    if (filteredVacancies.length === 0) {
        return (
            <motion.div className={s.fullscreenOverlay} layoutId="vacancy" transition={{duration: 0.2, ease: "easeOut", type: "tween"}}>
                <motion.div className={s.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                    <div className={s.header}>
                        <Link href="/" className={s.closeButton}>✕</Link>
                    </div>

                    {/* Контент для пустого состояния */}
                    <motion.div className={s.emptyContainer} initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
                        <div className={s.empty}>
                            {/* Анимированная иконка с подпрыгиванием */}
                            <motion.div
                                animate={{y: [0, -10, 0]}}  // Цикл: вверх-вниз
                                transition={{duration: 2, repeat: Infinity}}  // Бесконечное повторение
                                style={{fontSize: 48, marginBottom: 16}}
                            >
                                🔍
                            </motion.div>
                            <p>Нет вакансий</p>
                            <p className={s.hint}>Парсинг выполняется автоматически каждый день в 23:00</p>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }

    // === ОСНОВНОЙ UI: СПИСОК ВАКАНСИЙ ===
    return (
        <motion.div className={s.fullscreenOverlay} layoutId="vacancy"  initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.2, ease: "easeOut", type: "tween" }} exit={{opacity: 0}}>
            <motion.div className={s.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                <motion.div className={s.contentWrapper} initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
                    {/* ХЕДЕР */}
                    <div className={s.header}>
                        <select
                            className={s.filterSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                        >
                            <option value="date">📅 По дате (новые)</option>
                            <option value="salary-asc">💰 По зарплате (возрастание)</option>
                            <option value="salary-desc">💰 По зарплате (убывание)</option>
                        </select>
                        <Link href="/" className={s.closeButton}>✕</Link>
                    </div>

                    {/* СПИСОК ВАКАНСИЙ */}
                    <div className={s.vacancyList}>
                        {filteredVacancies.map((vacancy, index) => (
                            <motion.div
                                key={vacancy.id || index}
                                // Сохраняем ссылку на DOM элемент для Intersection Observer
                                ref={el => {
                                    cardsRef.current[index] = el
                                }}
                                data-index={index}
                                // Класс видимости: если индекс в Set, добавляем класс для анимации
                                className={`${s.vacancyCard} ${visibleCards.has(index) ? s.vacancyCardVisible : ''}`}
                                onClick={() => {
                                    // При клике открываем модальное окно с деталями
                                    setSelectedVacancy(vacancy);
                                    // setVacancyOpen(true);
                                }}
                                initial={{opacity: 0, y: 30}}   // Начинаем снизу и прозрачными
                                animate={{opacity: 1, y: 0}}     // Анимируем до нормального положения
                                transition={{delay: index * 0.05, duration: 0.4}}  // Задержка для каждой карточки
                                whileHover={{scale: 1.01}}        // При наведении чуть увеличивается
                                whileTap={{scale: 0.99}}          // При нажатии чуть уменьшается (эффект "клика")
                            >
                                <div className={s.vacancyContent}>
                                    {/* Верхняя часть карточки: иконка + профессия */}
                                    <div className={s.cardHeader}>
                                        <div className={s.Wrapper}>
                                            <div className={s.divIcon1}>📍</div>
                                            <h3 className={s.profession}>{vacancy.profession}</h3>
                                        </div>
                                        {/* Зарплата */}
                                        <div className={s.Wrapper}>
                                            <div className={s.divIcon2}>💰</div>
                                            <h5 className={s.salary}>{vacancy.salary}</h5>
                                        </div>
                                    </div>

                                    {/* Нижняя часть: кнопка и дата */}
                                    <div className={s.details}>
                                        <motion.button
                                            className={s.WatchVacancy}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                            onClick={(e) => {
                                                e.stopPropagation();  // Останавливаем всплытие, чтобы не сработал клик на карточке
                                                setSelectedVacancy(vacancy);
                                                setVacancyOpen(true);
                                            }}
                                        >
                                            Подробнее →
                                        </motion.button>
                                        <div className={s.dateWrapper}>{vacancy.date}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* МОДАЛЬНОЕ ОКНО С ДЕТАЛЯМИ ВАКАНСИИ */}
            {/* AnimatePresence позволяет анимировать появление и исчезновение */}
            <AnimatePresence>
                {vacancyOpen && selectedVacancy && (
                    <VacancyInfo
                        vacancy={selectedVacancy}
                        onClose={() => setVacancyOpen(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}