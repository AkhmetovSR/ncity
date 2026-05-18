// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const logs = await logger.getLogs();
        return NextResponse.json({ success: true, logs });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Ошибка получения логов' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await logger.clearLogs();
        return NextResponse.json({ success: true, message: 'Логи очищены' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Ошибка очистки логов' }, { status: 500 });
    }
}