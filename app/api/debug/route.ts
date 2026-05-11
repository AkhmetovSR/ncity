import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const url = 'https://trudvsem.ru/iblocks/_catalog/flat_filter_prr_search_vacancies/data?filter={"title":["нягань"],"regionCode":["8600000000000"]}&orderColumn=RELEVANCE_DESC&page=1&pageSize=10';

    // Копируем ВСЕ заголовки из Network в браузере
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="147"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'Referer': 'https://trudvsem.ru/vacancy/search?_title=%D0%BD%D1%8F%D0%B3%D0%B0%D0%BD%D1%8C&_regionIds=8600000000000',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
    };

    try {
        const response = await fetch(url, {
            headers,
            // Важно: без сжатия, чтобы не было проблем с декодированием
            compress: false
        });

        const text = await response.text();

        let json = null;
        try {
            json = JSON.parse(text);
        } catch (e) {
            // не JSON
        }

        return NextResponse.json({
            status: response.status,
            isJson: !!json,
            dataLength: json?.result?.data?.length,
            preview: text.substring(0, 300)
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}