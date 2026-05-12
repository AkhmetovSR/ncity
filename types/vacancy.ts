export interface Vacancy {
    id: string;
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
    companyInn: string;
    companyOgrn: string;
}

export type Mode = 'local' | 'vercel' | 'online';