import type { IAffiliate } from "@/types/company/affiliate/IAffiliate";
import type { ICreateAffiliate } from "@/types/company/affiliate/ICreateAffiliate";
import type { IGetAffiliate } from "@/types/company/affiliate/IGetAffiliate";
import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { serialize } from "object-to-formdata";

export const apiAffiliate = createApi({
    reducerPath: "apiAffiliate",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Affiliate"],
    endpoints: (builder) => ({
        getAll: builder.query<IAffiliate[], IGetAffiliate>({
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
        })
    })
})

export const { useGetAllQuery, useAddMutation } = apiAffiliate;