import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/parser/storage';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { vacancies } = body;

        if (!vacancies || vacancies.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Нет вакансий для сохранения'
            }, { status: 400 });
        }

        const storage = new Storage('edited');
        await storage.saveResults(vacancies);

        return NextResponse.json({
            success: true,
            message: `Сохранено ${vacancies.length} вакансий`
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}