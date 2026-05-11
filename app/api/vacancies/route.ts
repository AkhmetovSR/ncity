import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        try {
            await fs.access(config.DATA_DIR);
        } catch {
            return NextResponse.json([], { status: 200 });
        }

        const files = await fs.readdir(config.DATA_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        if (jsonFiles.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        jsonFiles.sort().reverse();
        const latestFile = jsonFiles[0];
        const filePath = path.join(config.DATA_DIR, latestFile);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const vacancies = JSON.parse(fileContent);

        return NextResponse.json(vacancies, { status: 200 });

    } catch (error: any) {
        console.error('Ошибка чтения вакансий:', error);
        return NextResponse.json([], { status: 200 });
    }
}