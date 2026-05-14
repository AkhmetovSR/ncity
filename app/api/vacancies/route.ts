// app/api/vacancies/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { config } from '@/lib/config/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Используем тот же путь, что и в Storage
        const DATA_DIR = config.DATA_DIR;

        console.log('DATA_DIR:', DATA_DIR);

        if (!fs.existsSync(DATA_DIR)) {
            return NextResponse.json([], { status: 200 });
        }

        const files = fs.readdirSync(DATA_DIR);
        console.log('Файлы:', files);

        const jsonFiles = files.filter(f =>
            f.startsWith('vacancies_') && f.endsWith('.json')
        );

        if (jsonFiles.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        jsonFiles.sort().reverse();
        const latestFile = jsonFiles[0];
        const filePath = path.join(DATA_DIR, latestFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const vacancies = JSON.parse(fileContent);

        return NextResponse.json(vacancies);

    } catch (error: any) {
        console.error('Ошибка:', error);
        return NextResponse.json([], { status: 200 });
    }
}