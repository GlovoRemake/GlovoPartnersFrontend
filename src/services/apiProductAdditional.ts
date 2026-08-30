import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {IAdditionalGroup} from "@/types/additional/IAdditionalGroup.ts";
import type {ICreateAdditionalGroup} from "@/types/additional/ICreateAdditionalGroup.ts";
import type {IUpdateAdditionalGroup} from "@/types/additional/IUpdateAdditionalGroup.ts";

export const apiProductAdditional = createApi({
    reducerPath: "apiProductAdditional",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["ProductAdditional"],
    endpoints: (builder) => ({
        get: builder.query<IAdditionalGroup[], {companyId: string, productId: number}>({
            query: (model) => {
                try {
                    return {
                        url: `/additional/all/${model.companyId}/${model.productId}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            },
            providesTags: ["ProductAdditional"]
        }),
        add: builder.mutation<void, {companyId: string, productId: number, body: ICreateAdditionalGroup}>({
            invalidatesTags: ["ProductAdditional"],
            query: (model) => {
                try {
                    return {
                        url: `/additional/create/${model.companyId}/${modal.productId}`,
                        method: "POST",
                        body: model.body,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        update: builder.mutation<void, {companyId: string, additionalId: number, body: IUpdateAdditionalGroup}>({
            invalidatesTags: ["ProductAdditional"],
            query: (model) => {
                try {
                    return {
                        url: `/additional/update/${model.companyId}/${model.additionalId}`,
                        method: "PUT",
                        body: model.body,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        delete: builder.mutation<void, {companyId: string, additionalId: number}>({
            invalidatesTags: ["ProductAdditional"],
            query: (model) => {
                try {
                    return {
                        url: `/additional/delete/${model.companyId}/${model.productId}`,
                        method: "DELETE",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        reorder: builder.mutation<void, {companyId: string, additionalId: number, ids: number[]}>({
            invalidatesTags: ["CompanyCategory"],
            query: (model) => {
                try {
                    return {
                        url: `/additional/reorder/${model.companyId}/${model.additionalId}`,
                        method: "PUT",
                        body: {ids: ids},
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useGetQuery, useAddMutation, useUpdateMutation, useDeleteMutation, useReorderMutation } = apiProductAdditional;