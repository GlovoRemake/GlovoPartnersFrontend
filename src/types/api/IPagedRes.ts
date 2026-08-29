export type IPagedRes<T, K extends string = "items"> = {
    [P in K]: T[];
} & {
    totalCount: number;
    totalPages: number;
};