export interface Vacancy {
    page: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
    _id?: number;
}

export type Mode = 'local' | 'vercel' | 'online';