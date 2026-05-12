import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const url = `https://trudvsem.ru/iblocks/_catalog/flat_filter_prr_search_vacancies/data?filter={"title":["нягань"],"regionCode":["8600000000000"]}&orderColumn=RELEVANCE_DESC&page=0&pageSize=5`;

    const response = await fetch(url, {
        headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
            'referer': 'https://trudvsem.ru/vacancy/search?_title=%D0%BD%D1%8F%D0%B3%D0%B0%D0%BD%D1%8C&_regionIds=8600000000000',
            'x-requested-with': 'XMLHttpRequest'
        }
    });

    const text = await response.text();

    // Проверяем, что вернулось
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        return NextResponse.json({
            error: 'Не JSON',
            preview: text.substring(0, 500)
        });
    }

    // Извлекаем только id и companyCode из первых 3 вакансий
    const samples = data.result.data.slice(0, 3).map((item: any[]) => ({
        vacancyId: item[0],
        companyCode: item[2],
        profession: item[1]
    }));

    return NextResponse.json({
        total: data.result.data.length,
        samples
    });
}