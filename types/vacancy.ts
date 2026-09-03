// types/vacancy.ts

export interface VacancyApiItem {
    id: string;
    profession: string;
    companyCode: string;
    organization: string;
    salaryMin: number;
    salaryMax: number;
    publishDate: number;
    regionName: string;
    scheduleType: string;
    busyType: string;
}

export interface Vacancy {
    id?: string;
    author_id?: string; // 🌟 СЕНЬОР-ФИКС: Поле для привязки вакансии к её создателю (Яндекс ID) в будущем, а сейчас анонимная кука
    page?: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
    busyType?: string;
    description?: string;
    requirements?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    experience?: string;
    education?: string;
    _id?: number;
}


//    "dev": "next dev --experimental-https --hostname 192.168.0.100",