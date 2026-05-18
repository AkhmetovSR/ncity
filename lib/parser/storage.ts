import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class Storage {
    // Сохранение результатов парсинга в файл
    async saveResults(jobs: Vacancy[]): Promise<{ jsonPath: string }> {
        // ✅ Защита от перезаписи пустым массивом
        if (!jobs || jobs.length === 0) throw new Error('Пустой список вакансий - отмена сохранения файла');
        // Создаем папку если её нет
        await fs.mkdir(config.DATA_DIR, { recursive: true });
        // Используем фиксированное имя файла: vacancyList.json
        const fileName = 'vacancyList.json';
        const jsonPath = path.join(config.DATA_DIR, fileName);
        // ✅ Атомарная запись через временный файл
        // Это гарантирует, что при ошибке оригинальный файл не повредится
        const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.json`;
        const tempPath = path.join(config.DATA_DIR, tempFileName);

        try {
            // Сначала сохраняем во временный файл
            const jsonData = JSON.stringify(jobs, null, 2);
            await fs.writeFile(tempPath, jsonData, 'utf8');
            // Атомарно заменяем основной файл (переименовываем)
            // В случае ошибки на этом этапе, старый файл останется нетронутым
            await fs.rename(tempPath, jsonPath);
        } catch (error) {
            // Если произошла ошибка - удаляем временный файл
            try {
                await fs.unlink(tempPath);
            } catch (unlinkError) {
                // Игнорируем ошибку удаления временного файла
            }
            throw new Error(`Не удалось сохранить вакансии: ${error}`);
        }
        return { jsonPath };
    }
}