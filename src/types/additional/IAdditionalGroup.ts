import type {IAdditional} from "@/types/additional/IAdditional.ts";

export interface IAdditionalGroup {
    id: number;
    name: string;
    minChoice: number;
    maxChoice: number;
    order: number;
    productId: number;
    additionals: IAdditional[]
}