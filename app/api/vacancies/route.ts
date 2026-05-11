import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Определяем папку с данными
        const dataDir = process.env.VERCEL ? '/tmp/parser-data' : path.join(process.cwd(), 'data');

        console.log(`🔍 Поиск вакансий в: ${dataDir}`);

        // Проверяем, существует ли папка
        try {
            await fs.access(dataDir);
        } catch {
            console.log(`❌ Папка ${dataDir} не существует`);
            // Возвращаем пустой массив, а не ошибку
            return NextResponse.json([], { status: 200 });
        }

        // Получаем список файлов
        const files = await fs.readdir(dataDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        console.log(`📄 Найдено JSON файлов: ${jsonFiles.length}`);

        if (jsonFiles.length === 0) {
            console.log(`❌ Нет JSON файлов в ${dataDir}`);
            return NextResponse.json([], { status: 200 });
        }

        // Сортируем по дате (новые первые)
        jsonFiles.sort().reverse();
        const latestFile = jsonFiles[0];

        console.log(`📄 Читаем файл: ${latestFile}`);

        // Читаем последний файл
        const filePath = path.join(dataDir, latestFile);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const vacancies = JSON.parse(fileContent);

        console.log(`✅ Загружено ${vacancies.length} вакансий`);

        return NextResponse.json(vacancies, { status: 200 });

    } catch (error: any) {
        console.error('Ошибка чтения вакансий:', error);
        // ВСЕГДА возвращаем JSON, даже при ошибке
        return NextResponse.json([], { status: 200 });
    }
}