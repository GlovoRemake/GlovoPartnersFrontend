import type {IUpdateAdditional} from "@/types/additional/IUpdateAdditional.ts";

export interface IUpdateAdditionalGroup {
    name: string;
    minChoice: number;
    maxChoice: number;
    additionals: IUpdateAdditional[];
}