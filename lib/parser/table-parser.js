const config = require('./config');

class TableParser {
    constructor($, pageNum) {
        this.$ = $;
        this.pageNum = pageNum;
    }

    findTable() {
        const $ = this.$;

        console.log(`   🔍 Поиск таблицы на странице ${this.pageNum}...`);

        // Поиск по точным атрибутам
        const table = $('table[border="7"][bordercolor="#96B1C4"][cellpadding="5"][cellspacing="2"][bgcolor="#FFFFFF"].text');

        if (table.length) {
            console.log(`   ✅ Таблица найдена по точным атрибутам`);
            return table.first();
        }

        // Альтернативный поиск
        const altTable = $('table[border="7"][bordercolor="#96B1C4"].text');
        if (altTable.length) {
            console.log(`   ✅ Таблица найдена по альтернативным атрибутам`);
            return altTable.first();
        }

        console.log(`   ❌ Таблица не найдена!`);
        return null;
    }

    parseVacancies() {
        const $ = this.$;
        const table = this.findTable();

        if (!table) {
            console.log(`   ⚠️ Нет таблицы на странице ${this.pageNum}`);
            return [];
        }

        const jobs = [];
        let headerRow = null;

        // Находим строку с заголовками
        table.find('tr').each((i, row) => {
            if ($(row).find('th').length) {
                headerRow = row;
                console.log(`   📋 Заголовки найдены в строке ${i}`);
                return false;
            }
        });

        if (!headerRow) {
            console.log(`   ⚠️ Не найдены заголовки таблицы`);
            return [];
        }

        // Парсим строки с данными
        let rowCount = 0;
        table.find('tr').each((i, row) => {
            if (row === headerRow) return;

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
                rowCount++;
            }
        });

        console.log(`   📊 На странице ${this.pageNum} найдено ${rowCount} вакансий`);
        return jobs;
    }
}

module.exports = TableParser;