import type {ILocation} from "@/types/company/affiliate/location/ILocation.ts";

export interface IAffiliate {
    id: string;
    phone: string;
    email: string;
    location: ILocation;
}