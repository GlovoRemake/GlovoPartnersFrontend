export interface IRequestCompany {
    id: number,
    name: string,
    description: string,
    isApprove?: boolean,
    message?: string,
    partnerId: string,
    companyId?: string
}