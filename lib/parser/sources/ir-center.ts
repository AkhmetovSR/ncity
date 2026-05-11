import * as cheerio from 'cheerio';
import { config } from '@/lib/config';
import { Vacancy } from '@/types/vacancy';

export class IrCenterParser {
    private cfg = config.irCenter;

    async parseJobs(): Promise<Vacancy[]> {
        const allJobs: Vacancy[] = [];

        for (let page = 1; page <= this.cfg.MAX_PAGES; page++) {
            console.log(`   📄 Страница ${page}...`);

            const url = `${this.cfg.BASE_URL}${this.cfg.VACANCY_PATH}?${this.cfg.BASE_PARAMS}&page=${page}`;

            try {
                const response = await fetch(url, {
                    headers: { 'User-Agent': this.cfg.USER_AGENT }
                });

                const buffer = await response.arrayBuffer();
                const decoded = this.decodeBuffer(buffer);
                const $ = cheerio.load(decoded);

                const jobs = this.parseTable($, page);

                if (jobs.length === 0) {
                    console.log(`      📭 Нет вакансий, завершаем`);
                    break;
                }

                allJobs.push(...jobs);
                console.log(`      ✅ Добавлено ${jobs.length} вакансий (всего: ${allJobs.length})`);

                await this.delay();

            } catch (error: any) {
                console.log(`      ❌ Ошибка: ${error.message}`);
            }
        }

        return allJobs;
    }

    private decodeBuffer(buffer: ArrayBuffer): string {
        const decoder = new TextDecoder('windows-1251');
        return decoder.decode(buffer);
    }

    private parseTable($: cheerio.CheerioAPI, pageNum: number): Vacancy[] {
        const jobs: Vacancy[] = [];

        const table = $('table[border="7"][bordercolor="#96B1C4"]');
        if (!table.length) return jobs;

        let headerRowIndex = -1;
        table.find('tr').each((i, row) => {
            if ($(row).find('th').length) {
                headerRowIndex = i;
                return false;
            }
        });

        if (headerRowIndex === -1) return jobs;

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
                    source: this.cfg.source,
                    page: pageNum,
                    profession: profession,
                    salary: $(cols[1]).text().trim(),
                    district: $(cols[2]).text().trim(),
                    organization: $(cols[3]).text().trim(),
                    date: $(cols[4]).text().trim(),
                    schedule: $(cols[5]).text().trim(),
                    busyType: 'не указан',
                    description: 'Описание отсутствует',
                    requirements: 'Не указаны',
                    address: 'Не указан',
                    phone: 'Не указан',
                    email: 'Не указан',
                    website: 'Не указан',
                    experience: 'Не указан',
                    education: 'Не указано',
                    contactPerson: 'Не указан'
                });
            }
        });

        return jobs;
    }

    private async delay(): Promise<void> {
        const min = this.cfg.MIN_DELAY_MS;
        const max = this.cfg.MAX_DELAY_MS;
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        console.log(`      ⏳ Пауза ${Math.round(delay / 1000)} сек...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}