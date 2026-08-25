// app/vacancy/page.tsx

import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import s from "@/app/vacancy/vacancy.module.css"

/**
 * Страница-заглушка Профиля пользователя.
 * Рендерится как полноценный независимый роут.
 */
export default function VacancyPage() {
    return (
        <div className={s.VacancyPage}>
            <VacancyList/>
        </div>
    );
}
