import pool from '@/lib/db';
import { Vacancy } from '@/types/vacancy';

/**
 * Извлекает список активных вакансий из базы данных.
 * Автоматически форматирует поля под интерфейс фронтенда.
 */
export async function getActiveVacancies(): Promise<Vacancy[]> {
    const query = `
        SELECT
            id,
            title AS profession,
            salary,
            company_name AS company,
            schedule,
            region,
            address,
            experience,
            education,
            contact_phone,
            contact_email,
            contact_website,
            description,
            requirements,
            is_active,
            to_char(created_at, 'DD.MM.YYYY') AS date
        FROM vacancies
        WHERE is_active = TRUE
        ORDER BY id DESC;
    `;

    // pool.query автоматически управляет коннекшенами под капотом
    const { rows } = await pool.query<Vacancy>(query);
    return rows;
}
