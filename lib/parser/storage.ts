// lib/storage.ts
import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class Storage {
    // Сохранение результатов парсинга в файл
    async saveResults(jobs: Vacancy[]): Promise<{ jsonPath: string }> {
        // Создаем папку если её нет
        await fs.mkdir(config.DATA_DIR, { recursive: true });

        // Формируем имя файла: vacancies_20260512_1234567890.json
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const timestamp = Date.now();
        const baseName = `vacancies_${dateStr}_${timestamp}`;

        // Сохраняем файл
        const jsonPath = path.join(config.DATA_DIR, `${baseName}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(jobs, null, 2), 'utf8');

        // Удаляем старые файлы
        await this.cleanOldFiles();

        return { jsonPath };
    }

    // Удаление старых файлов, чтобы папка не разрасталась
    private async cleanOldFiles(): Promise<void> {
        try {
            // Получаем все файлы в папке
            const files = await fs.readdir(config.DATA_DIR);

            // Отбираем только JSON файлы с вакансиями (исправлено: ищем vacancies_)
            const jsonFiles = files
                .filter(f => f.startsWith('vacancies_') && f.endsWith('.json'))
                .sort()
                .reverse();

            // Если файлов больше чем нужно - удаляем лишние
            if (jsonFiles.length > config.MAX_FILES_TO_KEEP) {
                const toDelete = jsonFiles.slice(config.MAX_FILES_TO_KEEP);
                for (const file of toDelete) {
                    const filePath = path.join(config.DATA_DIR, file);
                    await fs.unlink(filePath);
                }
            }
        } catch (error) {
            // Если ошибка - просто игнорируем, это не критично
        }
    }
}