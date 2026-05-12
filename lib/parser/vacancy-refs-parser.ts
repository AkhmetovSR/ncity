import * as cheerio from 'cheerio';

export interface VacancyRef {
    id: string;
    companyCode: string;
}

export class VacancyRefsParser {
    parse(html: string, pageNum: number): VacancyRef[] {
        if (!html) return [];

        const $ = cheerio.load(html);
        const refs: VacancyRef[] = [];

        // Пробуем разные селекторы
        const selectors = [
            '.search-results-simple-card',
            '[data-uid]',
            '.vacancy-card',
            '.job-card'
        ];

        for (const selector of selectors) {
            const elements = $(selector);
            if (elements.length > 0) {
                console.log(`   🔍 Найдено ${elements.length} элементов по селектору: ${selector}`);

                elements.each((_, element) => {
                    const $card = $(element);
                    const id = $card.data('uid') || $card.attr('data-uid');
                    const companyCode = $card.data('company-code') || $card.attr('data-company-code');

                    if (id && companyCode) {
                        refs.push({ id: String(id), companyCode: String(companyCode) });
                    }
                });

                if (refs.length > 0) break;
            }
        }

        // Если все еще нет, ищем в ссылках
        if (refs.length === 0) {
            $('a[href*="/vacancy/card/"]').each((_, element) => {
                const href = $(element).attr('href');
                if (href) {
                    const match = href.match(/\/vacancy\/card\/([^\/]+)\/([^\/]+)/);
                    if (match) {
                        refs.push({
                            companyCode: match[1],
                            id: match[2]
                        });
                    }
                }
            });
        }

        console.log(`   📊 На странице ${pageNum} найдено ${refs.length} ссылок на вакансии`);
        return refs;
    }
}