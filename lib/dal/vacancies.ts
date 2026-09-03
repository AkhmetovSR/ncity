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
            author_id,                    -- 🌟 СЕНЬОР-ФИКС: Обязательно достаем ID автора из БД
            title AS profession,
            salary,
            company_name AS organization, 
            schedule,
            region AS district,           
            address,
            experience,
            education,
            contact_phone AS phone,       
            contact_email AS email,       
            contact_website AS website,   
            description,
            requirements,
            is_active,
            to_char(created_at, 'DD.MM.YYYY') AS date
        FROM vacancies
        WHERE is_active = TRUE
        ORDER BY id DESC
        LIMIT $1 OFFSET $2; 
    `;

    const { rows } = await pool.query<Vacancy>(query, [limit, offset]);
    return rows;
}

/**
 * 🌟 СЕНЬОР-ФИКС: Функция для сохранения новой вакансии в БД с привязкой к автору.
 */
export async function createVacancy(vacancyData: Vacancy & { author_id: string }): Promise<void> {
    const query = `
        INSERT INTO vacancies (
            author_id,
            title,
            salary,
            company_name,
            region,
            schedule,
            description,
            requirements,
            is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE);
    `;

    const values = [
        vacancyData.author_id,
        vacancyData.profession,
        vacancyData.salary || null,
        vacancyData.organization,
        vacancyData.district || null,
        vacancyData.schedule || null,
        vacancyData.description,
        vacancyData.requirements || null
    ];

    await pool.query(query, values);
}
