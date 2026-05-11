import { Vacancy } from '@/types/vacancy';

export interface ParserSource {
    name: string;
    parseJobs(): Promise<Vacancy[]>;
}

export interface ParserConstructor {
    new (): ParserSource;
}