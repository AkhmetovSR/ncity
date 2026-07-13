// app/api/vacancies/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    let client;
    try {
        client = await pool.connect();

        // SQL-запрос с маппингом полей (AS) под интерфейс Vacancy.
        // Форматируем TIMESTAMP из БД в строку "ДД.ММ.ГГГГ" для клиентской функции parseDate.
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

        const { rows } = await client.query(query);

        return NextResponse.json(rows);
    } catch (error: unknown) {
        console.error('Ошибка при запросе к PostgreSQL:', error);
        // Возвращаем пустой массив, защищая фронтенд от падения при сбоях БД
        return NextResponse.json([], { status: 200 });
    } finally {
        if (client) {
            client.release(); // Освобождаем соединение обратно в пул
        }
    }
}
