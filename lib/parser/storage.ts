import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class Storage {
    private readonly MAX_FILES_TO_KEEP: number = 5;

    async saveResults(jobs: Vacancy[]): Promise<{ jsonPath: string }> {
        await fs.mkdir(config.DATA_DIR, { recursive: true });

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const timestamp = Date.now();
        const baseName = `trudvsem_${dateStr}_${timestamp}`;

        const jsonPath = path.join(config.DATA_DIR, `${baseName}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(jobs, null, 2), 'utf8');

        console.log(`   ✅ Сохранено: ${baseName}.json`);

        await this.cleanOldFiles();
        return { jsonPath };
    }

    private async cleanOldFiles(): Promise<void> {
        try {
            const files = await fs.readdir(config.DATA_DIR);
            const jsonFiles = files
                .filter(f => f.startsWith('trudvsem_') && f.endsWith('.json'))
                .sort()
                .reverse();

            if (jsonFiles.length > this.MAX_FILES_TO_KEEP) {
                const toDelete = jsonFiles.slice(this.MAX_FILES_TO_KEEP);
                for (const file of toDelete) {
                    const filePath = path.join(config.DATA_DIR, file);
                    await fs.unlink(filePath);
                    console.log(`   🗑️ Удален старый файл: ${file}`);
                }
            }
        } catch (error) {
            console.log(`   ⚠️ Ошибка очистки: ${error}`);
        }
    }
}