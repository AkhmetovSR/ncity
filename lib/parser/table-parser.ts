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

        const table = $('table[border="7"][bordercolor="#96B1C4"][cellpadding="5"][cellspacing="2"][bgcolor="#FFFFFF"].text');
        if (table.length) return table.first();

        const altTable = $('table[border="7"][bordercolor="#96B1C4"].text');
        if (altTable.length) return altTable.first();

        return null;
    }

    parseVacancies(): Vacancy[] {
        const $ = this.$;
        const table = this.findTable();
        if (!table) return [];

        const jobs: Vacancy[] = [];
        let headerRowIndex = -1;

        table.find('tr').each((i, row) => {
            if ($(row).find('th').length) {
                headerRowIndex = i;
                return false;
            }
        });

        if (headerRowIndex === -1) return [];

        table.find('tr').each((i, row) => {
            if (i === headerRowIndex) return;

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
        return jobs;
    }
}