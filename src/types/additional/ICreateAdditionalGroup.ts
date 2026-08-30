import type {ICreateAdditional} from "@/types/additional/ICreateAdditional.ts";

export interface ICreateAdditionalGroup {
    name: string;
    minChoice: number;
    maxChoice: number;
    additionals: ICreateAdditional[];
}