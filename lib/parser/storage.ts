import fs from 'fs/promises';
import path from 'path';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class Storage {
    private readonly mode: string;
    private readonly MAX_FILES_TO_KEEP: number = 5;

    constructor(mode: string) {
        this.mode = mode;
    }

    async saveResults(jobs: Vacancy[]): Promise<{ jsonPath: string }> {
        await fs.mkdir(config.DATA_DIR, { recursive: true });

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const timestamp = Date.now();
        const baseName = `jobs_${this.mode}_${dateStr}_${timestamp}`;

        const jsonPath = path.join(config.DATA_DIR, `${baseName}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(jobs, null, 2), 'utf8');
        await this.cleanOldFiles();

        return { jsonPath };
    }

    private async cleanOldFiles(): Promise<void> {
        try {
            const files = await fs.readdir(config.DATA_DIR);
            const jsonFiles = files
                .filter(f => f.startsWith('jobs_') && f.endsWith('.json'))
                .sort()
                .reverse();

            if (jsonFiles.length > this.MAX_FILES_TO_KEEP) {
                const toDelete = jsonFiles.slice(this.MAX_FILES_TO_KEEP);
                for (const file of toDelete) {
                    const filePath = path.join(config.DATA_DIR, file);
                    await fs.unlink(filePath);
                }
            }
        } catch (error) {
            console.log(`   ⚠️ Ошибка очистки: ${error}`);
        }
    }
}

// import fs from 'fs/promises';
// import path from 'path';
// import { config } from '@/lib/config';
// import { Vacancy } from '@/types/vacancy';
//
// export class Storage {
//     private readonly mode: string;
//     private readonly MAX_FILES_TO_KEEP: number = 5;
//
//     constructor(mode: string) {
//         this.mode = mode;
//     }
//
//     async saveResults(jobs: Vacancy[]): Promise<{ jsonPath: string; csvPath: string }> {
//         await fs.mkdir(config.DATA_DIR, { recursive: true });
//
//         const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
//         const timestamp = Date.now();
//         const baseName = `jobs_${this.mode}_${dateStr}_${timestamp}`;
//
//         const jsonPath = path.join(config.DATA_DIR, `${baseName}.json`);
//         await fs.writeFile(jsonPath, JSON.stringify(jobs, null, 2), 'utf8');
//
//         const csvPath = path.join(config.DATA_DIR, `${baseName}.csv`);
//         const csv = this.toCSV(jobs);
//         await fs.writeFile(csvPath, '\uFEFF' + csv, 'utf8');
//
//         await this.cleanOldFiles();
//
//         return { jsonPath, csvPath };
//     }
//
//     private async cleanOldFiles(): Promise<void> {
//         try {
//             const files = await fs.readdir(config.DATA_DIR);
//             const jsonFiles = files
//                 .filter(f => f.startsWith('jobs_') && f.endsWith('.json'))
//                 .sort()
//                 .reverse();
//
//             if (jsonFiles.length > this.MAX_FILES_TO_KEEP) {
//                 const toDelete = jsonFiles.slice(this.MAX_FILES_TO_KEEP);
//                 for (const file of toDelete) {
//                     const filePath = path.join(config.DATA_DIR, file);
//                     await fs.unlink(filePath);
//
//                     const csvFile = file.replace('.json', '.csv');
//                     try {
//                         const csvPath = path.join(config.DATA_DIR, csvFile);
//                         await fs.unlink(csvPath);
//                     } catch {
//                         // CSV файла может не быть
//                     }
//                 }
//             }
//             console.log(`   📁 В папке ${this.MAX_FILES_TO_KEEP} последних файлов`);
//         } catch (error) {
//             console.log(`   ⚠️ Ошибка очистки: ${error}`);
//         }
//     }
//
//     private toCSV(jobs: Vacancy[]): string {
//         const header = 'Страница;Профессия;Зарплата;Район;Организация;Дата;График\n';
//         const rows = jobs.map(j => {
//             return `"${j.page}";"${this.escapeCSV(j.profession)}";"${this.escapeCSV(j.salary)}";"${this.escapeCSV(j.district)}";"${this.escapeCSV(j.organization)}";"${this.escapeCSV(j.date)}";"${this.escapeCSV(j.schedule)}"`;
//         }).join('\n');
//         return header + rows;
//     }
//
//     private escapeCSV(str: string): string {
//         return String(str || '').replace(/"/g, '""');
//     }
// }