import type { WeightType } from "@/enums/WeightType";

export interface ICreateProduct {
    name: string;
    description: string;
    image: File;
    price: number;
    categoryId: number;
    weight?: number;
    weightType?: WeightType;
    kcal?: number;
    companyId: string;
}