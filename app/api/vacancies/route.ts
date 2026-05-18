// app/api/vacancies/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const DATA_DIR = config.DATA_DIR;
        // Используем фиксированное имя файла
        const fileName = 'vacancyList.json';
        const filePath = path.join(DATA_DIR, fileName);
        // Проверяем, существует ли файл
        if (!fs.existsSync(filePath)) {
            console.log('Файл vacancyList.json не найден');
            return NextResponse.json([], { status: 200 });
        }
        // Читаем файл
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const vacancies = JSON.parse(fileContent);
        return NextResponse.json(vacancies);

    } catch (error: any) {
        return NextResponse.json([], { status: 200 });
    }
}