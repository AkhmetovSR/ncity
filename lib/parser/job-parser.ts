import { TrudvsemParser } from './sources/trudvsem';
import { IrCenterParser } from './sources/ir-center';
import { Storage } from './storage';
import { Vacancy } from '@/types/vacancy';

export class JobParser {
    private storage: Storage;
    public allJobs: Vacancy[] = [];

    constructor() {
        this.storage = new Storage();
    }

    async parseJobs(): Promise<{ success: boolean; jobsCount: number; message?: string }> {
        console.log(`🚀 Запуск парсинга с двух источников\n`);
        console.log(`═`.repeat(50));

        // 1. Парсим trudvsem.ru
        console.log(`\n📌 ИСТОЧНИК 1: trudvsem.ru`);
        console.log(`─`.repeat(40));

        const trudvsemParser = new TrudvsemParser();
        const trudvsemJobs = await trudvsemParser.parseJobs();
        this.allJobs.push(...trudvsemJobs);

        console.log(`\n📊 trudvsem.ru: ${trudvsemJobs.length} вакансий`);

        // 2. Парсим ir-center.ru
        console.log(`\n📌 ИСТОЧНИК 2: ir-center.ru`);
        console.log(`─`.repeat(40));

        const irCenterParser = new IrCenterParser();
        const irCenterJobs = await irCenterParser.parseJobs();
        this.allJobs.push(...irCenterJobs);

        console.log(`\n📊 ir-center.ru: ${irCenterJobs.length} вакансий`);

        // 3. Итоги
        console.log(`\n${`═`.repeat(50)}`);
        console.log(`\n📊 ОБЩИЙ РЕЗУЛЬТАТ:`);
        console.log(`   trudvsem.ru: ${trudvsemJobs.length} вакансий`);
        console.log(`   ir-center.ru: ${irCenterJobs.length} вакансий`);
        console.log(`   ВСЕГО: ${this.allJobs.length} вакансий`);

        if (this.allJobs.length > 0) {
            await this.storage.saveResults(this.allJobs);
            return {
                success: true,
                jobsCount: this.allJobs.length,
                message: `Собрано ${this.allJobs.length} вакансий с двух сайтов`
            };
        }

        return { success: false, jobsCount: 0, message: 'Вакансии не найдены' };
    }
}