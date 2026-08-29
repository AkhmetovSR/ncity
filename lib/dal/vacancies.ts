// import pool from '@/lib/db';
// import { Vacancy } from '@/types/vacancy';
//
// /**
//  * Извлекает список активных вакансий из базы данных.
//  * Автоматически форматирует поля под интерфейс фронтенда.
//  */
// export async function getActiveVacancies(): Promise<Vacancy[]> {
//     const query = `
//         SELECT
//             id,
//             title AS profession,
//             salary,
//             company_name AS company,
//             schedule,
//             region,
//             address,
//             experience,
//             education,
//             contact_phone,
//             contact_email,
//             contact_website,
//             description,
//             requirements,
//             is_active,
//             to_char(created_at, 'DD.MM.YYYY') AS date
//         FROM vacancies
//         WHERE is_active = TRUE
//         ORDER BY id DESC;
//     `;
//
//     // pool.query автоматически управляет коннекшенами под капотом
//     const { rows } = await pool.query<Vacancy>(query);
//     return rows;
// }
// lib/dal/vacancies.ts
import pool from '@/lib/db';
import { Vacancy } from '@/types/vacancy';

/**
 * Извлекает порцию активных вакансий из базы данных с поддержкой пагинации.
 */
export async function getActiveVacancies(limit: number = 50, offset: number = 0): Promise<Vacancy[]> {
    const query = `
        SELECT 
            id,
            title AS profession,
            salary,
            company_name AS organization, -- Поправил под ваш тип, в SQL было AS company
            schedule,
            region AS district,           -- Поправил под ваш тип, в SQL было AS region
            address,
            experience,
            education,
            contact_phone AS phone,       -- Поправил под ваш тип
            contact_email AS email,       -- Поправил под ваш тип
            contact_website AS website,   -- Поправил под ваш тип
            description,
            requirements,
            is_active,
            to_char(created_at, 'DD.MM.YYYY') AS date
        FROM vacancies
        WHERE is_active = TRUE
        ORDER BY id DESC
        LIMIT $1 OFFSET $2; -- 🌟 СЕНЬОР-ФИКС: Пагинация на уровне базы данных
    `;

    // Передаем параметры в безопасный массив значений pool.query
    const { rows } = await pool.query<Vacancy>(query, [limit, offset]);
    return rows;
}
