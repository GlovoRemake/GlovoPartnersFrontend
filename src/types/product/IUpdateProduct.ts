import type { WeightType } from "@/enums/WeightType";

export interface IUpdateProduct {
    name: string;
    description: string;
    image?: File | null;
    price: number;
    categoryId: number;
    weight?: number;
    weightType?: WeightType;
    kcal?: number;
    companyId: string;
    productId: number;
}