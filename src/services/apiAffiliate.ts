import type { IAffiliate } from "@/types/company/affiliate/IAffiliate";
import type { ICreateAffiliate } from "@/types/company/affiliate/ICreateAffiliate";
import type { IGetAffiliate } from "@/types/company/affiliate/IGetAffiliate";
import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {IPagedRes} from "@/types/api/IPagedRes.ts";
import type {IUpdateAffiliate} from "@/types/company/affiliate/IUpdateAffiliate.ts";

export const apiAffiliate = createApi({
    reducerPath: "apiAffiliate",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Affiliate"],
    endpoints: (builder) => ({
        getAll: builder.query<IPagedRes<IAffiliate, "affiliates">, IGetAffiliate>({
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/all/${model.companyId}?pageNumber=${model.pageNumber}&pageSize=${model.pageSize}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        add: builder.mutation<void, ICreateAffiliate>({
            invalidatesTags: ["Affiliate"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/add/${model.companyId}`,
                        method: "POST",
                        body: model,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        update: builder.mutation<void, {affiliateId: string, body: IUpdateAffiliate}>({
            invalidatesTags: ["Affiliate"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/update/${model.affiliateId}`,
                        method: "PUT",
                        body: model.body,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useGetAllQuery, useAddMutation, useUpdateMutation } = apiAffiliate;