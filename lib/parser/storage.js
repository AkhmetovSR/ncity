const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

class Storage {
    constructor(mode) {
        this.mode = mode;
    }

    async saveResults(jobs) {
        // Создаем директорию (на Vercel будет /tmp)
        await fs.mkdir(config.DATA_DIR, { recursive: true });

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const timestamp = Date.now();
        const baseName = `nyagan_jobs_${this.mode}_${dateStr}_${timestamp}`;

        // Сохраняем JSON
        const jsonPath = path.join(config.DATA_DIR, `${baseName}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(jobs, null, 2), 'utf8');

        // Сохраняем CSV
        const csvPath = path.join(config.DATA_DIR, `${baseName}.csv`);
        const csv = this.toCSV(jobs);
        await fs.writeFile(csvPath, '\uFEFF' + csv, 'utf8');

        console.log(`💾 Сохранено:\n   JSON: ${jsonPath}\n   CSV: ${csvPath}`);

        return { jsonPath, csvPath };
    }

    toCSV(jobs) {
        const header = 'Страница;Профессия;Зарплата;Район;Организация;Дата подтверждения;График\n';
        const rows = jobs.map(j => {
            return `"${j.page}";"${this.escapeCSV(j.profession)}";"${this.escapeCSV(j.salary)}";"${this.escapeCSV(j.district)}";"${this.escapeCSV(j.organization)}";"${this.escapeCSV(j.date)}";"${this.escapeCSV(j.schedule)}"`;
        }).join('\n');
        return header + rows;
    }

    escapeCSV(str) {
        return String(str || '').replace(/"/g, '""');
    }
}

module.exports = Storage;