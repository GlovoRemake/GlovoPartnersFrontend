export interface IRequestCompany {
    id: number,
    name: string,
    description: string,
    isApprove?: boolean,
    message?: string,
    iconPath?: string,
    bannerPath?: string,
    partnerId: string,
    companyId?: string
}