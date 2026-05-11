export interface Vacancy {
    source: string;          // trudvsem.ru или ir-center.ru
    id?: string;
    page: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
    busyType: string;
    description: string;
    requirements: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    experience: string;
    education: string;
    contactPerson?: string;
    workPlaces?: number;
}

export type Mode = 'local' | 'vercel' | 'online';