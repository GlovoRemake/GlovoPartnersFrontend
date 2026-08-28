import type { ICreateAffiliateLocation } from "./location/ICreateAffiliateLocation";

export interface ICreateAffiliate {
    phone: string;
    email: string;

    location: ICreateAffiliateLocation;
    companyId: string;
}