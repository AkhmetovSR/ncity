import * as cheerio from 'cheerio';
import { config } from '@/lib/config';

interface Vacancy {
    page: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
}

export class TableParser {
    private $: cheerio.CheerioAPI;
    private pageNum: number;

    constructor($: cheerio.CheerioAPI, pageNum: number) {
        this.$ = $;
        this.pageNum = pageNum;
    }

    private findTable(): cheerio.Cheerio<any> | null {
        const $ = this.$;

        console.log(`   🔍 Поиск таблицы на странице ${this.pageNum}...`);

        // Поиск по точным атрибутам
        const table = $('table[border="7"][bordercolor="#96B1C4"][cellpadding="5"][cellspacing="2"][bgcolor="#FFFFFF"].text');
        if (table.length) return table.first();

        // Альтернативный поиск
        const altTable = $('table[border="7"][bordercolor="#96B1C4"].text');
        if (altTable.length) return altTable.first();

        return null;
    }

    parseVacancies(): Vacancy[] {
        const $ = this.$;
        const table = this.findTable();

        if (!table) return [];

        const jobs: Vacancy[] = [];

        // Находим строку с заголовками (используем index вместо типа Element)
        let headerRowIndex = -1;

        table.find('tr').each((i, row) => {
            if ($(row).find('th').length) {
                headerRowIndex = i;
                return false; // останавливаем цикл
            }
        });

        if (headerRowIndex === -1) return [];

        // Парсим строки с данными
        table.find('tr').each((i, row) => {
            if (i === headerRowIndex) return; // пропускаем строку с заголовками

            const cols = $(row).find('td');
            if (cols.length < 6) return;

            const professionLink = $(cols[0]).find('a');
            const profession = professionLink.length
                ? professionLink.text().trim()
                : $(cols[0]).text().trim();

            if (profession && profession.length > 2) {
                jobs.push({
                    page: this.pageNum,
                    profession: profession,
                    salary: $(cols[1]).text().trim(),
                    district: $(cols[2]).text().trim(),
                    organization: $(cols[3]).text().trim(),
                    date: $(cols[4]).text().trim(),
                    schedule: $(cols[5]).text().trim()
                });
            }
        });

        console.log(`   📊 На странице ${this.pageNum} найдено ${jobs.length} вакансий`);
        return jobs;
    }
}