import type { WeightType } from "@/enums/WeightType";
import type { ICategory } from "../companyCategory/ICategory";

export interface IProduct {
    id: number;
    name: string;
    description: string;
    imagePath: string;
    order: number;
    price: number;
    category: ICategory;
    weight?: number;
    weightType?: WeightType | null;
    kcal?: number;
}