import * as cheerio from 'cheerio';
import { Vacancy } from '@/types/vacancy';

export class TableParser {
    private readonly $: cheerio.CheerioAPI;
    private readonly pageNum: number;

    constructor($: cheerio.CheerioAPI, pageNum: number) {
        this.$ = $;
        this.pageNum = pageNum;
    }

    private findTable(): cheerio.Cheerio<any> | null {
        const $ = this.$;
        console.log(`   🔍 Поиск таблицы на странице ${this.pageNum}...`);

        // Новая версия сайта — ищем таблицу с bordercolor="#4B83B6"
        const table = $('table[border="7"][bordercolor="#4B83B6"]');
        if (table.length) {
            console.log(`   ✅ Таблица найдена (новая версия)`);
            return table.first();
        }

        // Старая версия — для обратной совместимости
        const oldTable = $('table[border="7"][bordercolor="#96B1C4"][cellpadding="5"][cellspacing="2"][bgcolor="#FFFFFF"].text');
        if (oldTable.length) {
            console.log(`   ✅ Таблица найдена (старая версия)`);
            return oldTable.first();
        }

        const altTable = $('table[border="7"][bordercolor="#96B1C4"].text');
        if (altTable.length) {
            console.log(`   ✅ Таблица найдена (альтернативная)`);
            return altTable.first();
        }

        console.log(`   ⚠️ Таблица не найдена`);
        return null;
    }

    parseVacancies(): Vacancy[] {
        const $ = this.$;
        const table = this.findTable();
        if (!table) return [];

        const jobs: Vacancy[] = [];
        let headerRowIndex = -1;

        // Находим строку с заголовками
        table.find('tr').each((i, row) => {
            // Ищем th или strong (в новой версии заголовки в strong)
            if ($(row).find('th').length || $(row).find('strong').length) {
                headerRowIndex = i;
                return false;
            }
        });

        if (headerRowIndex === -1) {
            console.log(`   ⚠️ Заголовки не найдены`);
            return [];
        }

        // Парсим строки с данными
        table.find('tr').each((i, row) => {
            if (i === headerRowIndex) return;

            const cols = $(row).find('td');
            if (cols.length < 5) return;  // минимум 5 колонок

            // Профессия (может быть в ссылке)
            const professionLink = cols.eq(0).find('a');
            const profession = professionLink.length
                ? professionLink.text().trim()
                : cols.eq(0).text().trim();

            if (!profession || profession.length < 2) return;

            jobs.push({
                page: this.pageNum,
                profession: profession,
                salary: cols.eq(1).text().trim() || 'Не указана',
                district: cols.eq(2).text().trim() || 'Не указан',
                organization: cols.eq(3).text().trim() || 'Не указана',
                date: cols.eq(4).text().trim() || 'Не указана',
                schedule: cols.eq(5).length ? cols.eq(5).text().trim() : 'Не указан'
            });
        });

        console.log(`   📊 На странице ${this.pageNum} найдено ${jobs.length} вакансий`);
        return jobs;
    }
}