import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Определяем папку с данными (как в config.js)
        const dataDir = process.env.VERCEL ? '/tmp/parser-data' : path.join(process.cwd(), 'data');

        // Проверяем, существует ли папка
        try {
            await fs.access(dataDir);
        } catch {
            return NextResponse.json([], { status: 404, statusText: 'Нет сохраненных данных' });
        }

        // Получаем список файлов
        const files = await fs.readdir(dataDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        if (jsonFiles.length === 0) {
            return NextResponse.json([], { status: 404, statusText: 'Нет JSON файлов' });
        }

        // Сортируем по дате (новые первые)
        jsonFiles.sort().reverse();
        const latestFile = jsonFiles[0];

        // Читаем последний файл
        const filePath = path.join(dataDir, latestFile);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const vacancies = JSON.parse(fileContent);

        return NextResponse.json(vacancies);

    } catch (error: any) {
        console.error('Ошибка чтения вакансий:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}