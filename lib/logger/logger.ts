// lib/logger.ts
import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';
import { LogEntry } from '@/types/log';

class Logger {
    private readonly LOG_FILE = 'parser_logs.json';
    private readonly MAX_LOGS = 1000; // Храним последние 1000 записей

    // Добавление записи в лог
    async addLog(
        level: LogEntry['level'],
        message: string,
        source: LogEntry['source'],
        details?: any
    ): Promise<void> {
        try {
            // Создаем папку если её нет
            await fs.mkdir(config.DATA_DIR, { recursive: true });

            const logPath = path.join(config.DATA_DIR, this.LOG_FILE);

            // Читаем существующие логи
            let logs: LogEntry[] = [];
            try {
                const content = await fs.readFile(logPath, 'utf8');
                logs = JSON.parse(content);
            } catch (error) {
                // Файла нет - начинаем новый массив
                logs = [];
            }

            // Добавляем новую запись
            const newLog: LogEntry = {
                id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                level,
                message,
                source,
                details
            };

            logs.unshift(newLog); // Добавляем в начало (свежие сверху)

            // Ограничиваем количество записей
            if (logs.length > this.MAX_LOGS) {
                logs = logs.slice(0, this.MAX_LOGS);
            }

            // Сохраняем обратно
            await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf8');

            // В консоль тоже выводим для отладки
            console.log(`[${level.toUpperCase()}] ${message}`);
        } catch (error) {
            console.error('Ошибка при записи лога:', error);
        }
    }

    // Получение всех логов
    async getLogs(): Promise<LogEntry[]> {
        try {
            const logPath = path.join(config.DATA_DIR, this.LOG_FILE);
            const content = await fs.readFile(logPath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return [];
        }
    }

    // Очистка логов
    async clearLogs(): Promise<void> {
        try {
            const logPath = path.join(config.DATA_DIR, this.LOG_FILE);
            await fs.writeFile(logPath, JSON.stringify([], null, 2), 'utf8');
        } catch (error) {
            console.error('Ошибка при очистке логов:', error);
        }
    }

    // Удобные методы для разных типов логов
    async info(message: string, source: string = 'system', details?: any) {
        await this.addLog('info', message, source, details);
    }

    async success(message: string, source: string = 'system', details?: any) {
        await this.addLog('success', message, source, details);
    }

    async error(message: string, source: string = 'system', details?: any) {
        await this.addLog('error', message, source, details);
    }

    async warning(message: string, source: string = 'system', details?: any) {
        await this.addLog('warning', message, source, details);
    }
}

export const logger = new Logger();