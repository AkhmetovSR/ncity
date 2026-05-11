import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class Storage {
    private MAX_FILES_TO_KEEP: number = 5;

    async saveResults(jobs: Vacancy[]): Promise<{ jsonPath: string; csvPath: string }> {
        await fs.mkdir(config.DATA_DIR, { recursive: true });

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const timestamp = Date.now();
        const baseName = `vacancies_${dateStr}_${timestamp}`;

        // Сохраняем JSON
        const jsonPath = path.join(config.DATA_DIR, `${baseName}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(jobs, null, 2), 'utf8');

        // Сохраняем CSV
        const csvPath = path.join(config.DATA_DIR, `${baseName}.csv`);
        const csv = this.toCSV(jobs);
        await fs.writeFile(csvPath, '\uFEFF' + csv, 'utf8');

        console.log(`   ✅ Сохранено: ${baseName}.json и .csv`);
        console.log(`   📁 Путь: ${config.DATA_DIR}`);

        // Очищаем старые файлы
        await this.cleanOldFiles();

        return { jsonPath, csvPath };
    }

    private async cleanOldFiles(): Promise<void> {
        try {
            const files = await fs.readdir(config.DATA_DIR);
            const jsonFiles = files
                .filter(f => f.startsWith('vacancies_') && f.endsWith('.json'))
                .sort()
                .reverse();

            if (jsonFiles.length > this.MAX_FILES_TO_KEEP) {
                const toDelete = jsonFiles.slice(this.MAX_FILES_TO_KEEP);
                for (const file of toDelete) {
                    const filePath = path.join(config.DATA_DIR, file);
                    await fs.unlink(filePath);
                    console.log(`   🗑️ Удален старый JSON: ${file}`);

                    const csvFile = file.replace('.json', '.csv');
                    try {
                        const csvPath = path.join(config.DATA_DIR, csvFile);
                        await fs.unlink(csvPath);
                        console.log(`   🗑️ Удален старый CSV: ${csvFile}`);
                    } catch {
                        // CSV файла может не быть
                    }
                }
            }

            console.log(`   📁 Хранится последних ${this.MAX_FILES_TO_KEEP} файлов`);
        } catch (error) {
            console.log(`   ⚠️ Ошибка очистки: ${error}`);
        }
    }

    private toCSV(jobs: Vacancy[]): string {
        const header = 'Источник;Страница;Профессия;Зарплата;Район;Организация;Дата;График;Тип занятости;Описание;Требования;Адрес;Телефон;Email;Сайт;Опыт;Образование;Контактное лицо;Кол-во мест\n';
        const rows = jobs.map(j => {
            return `"${this.escapeCSV(j.source)}";"${j.page}";"${this.escapeCSV(j.profession)}";"${this.escapeCSV(j.salary)}";"${this.escapeCSV(j.district)}";"${this.escapeCSV(j.organization)}";"${this.escapeCSV(j.date)}";"${this.escapeCSV(j.schedule)}";"${this.escapeCSV(j.busyType)}";"${this.escapeCSV(j.description)}";"${this.escapeCSV(j.requirements)}";"${this.escapeCSV(j.address)}";"${this.escapeCSV(j.phone)}";"${this.escapeCSV(j.email)}";"${this.escapeCSV(j.website)}";"${this.escapeCSV(j.experience)}";"${this.escapeCSV(j.education)}";"${this.escapeCSV(j.contactPerson || '')}";"${j.workPlaces || 0}"`;
        }).join('\n');
        return header + rows;
    }

    private escapeCSV(str: string): string {
        return String(str || '').replace(/"/g, '""');
    }
}