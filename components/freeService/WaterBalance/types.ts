export interface WaterBalanceInputs {
    organization: string;
    fio: string;
    address: string;
    phone: string;
    residents: number;
    gardenArea: number;
    hasBanya: boolean;
    hasPool: boolean;
    poolVolume: number;
}

export interface WaterBalanceResults {
    waterPeople: number;
    sewagePeople: number;
    waterGarden: number;
    sewageGarden: number;
    waterBanya: number;
    sewageBanya: number;
    waterPool: number;
    sewagePool: number;
    totalWater: number;
    totalSewage: number;
}

// Добавляем organization как опциональное поле ошибок
export interface FormErrors {
    organization?: string;
    fio?: string;
    address?: string;
    phone?: string;
}
