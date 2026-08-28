import type { ICategory } from "@/types/companyCategory/ICategory";
import type { IAddCategory } from "@/types/companyCategory/IAddCategory";
import type { IEditCategory } from "@/types/companyCategory/IEditCategory";
import type { IDeleteCategory } from "@/types/companyCategory/IDeleteCategory";
import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { IReorderCategory } from "@/types/companyCategory/IReorderCategory";

export const apiCompanyCategory = createApi({
    reducerPath: "apiCompanyCategory",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["CompanyCategory"],
    endpoints: (builder) => ({
        getAll: builder.query<ICategory[], string>({
            providesTags: ["CompanyCategory"],
            query: (companyId) => {
                try {
                    return {
                        url: `/company/category/all?CompanyId=${companyId}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        add: builder.mutation<void, IAddCategory>({
            invalidatesTags: ["CompanyCategory"],
            query: (model) => {
                try {
                    return {
                        url: `/company/category/add/${model.companyId}`,
                        method: "POST",
                        body: model,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        edit: builder.mutation<void, IEditCategory>({
            invalidatesTags: ["CompanyCategory"],
            query: (model) => {
                const data = {
                    idCategory: model.idCategory,
                    name: model.name
                }
                try {
                    return {
                        url: `/company/category/edit/${model.companyId}`,
                        method: "PUT",
                        body: data,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        delete: builder.mutation<void, IDeleteCategory>({
            invalidatesTags: ["CompanyCategory"],
            query: (model) => {
                try {
                    return {
                        url: `/company/category/remove/${model.companyId}?IdCategory=${model.idCategory}`,
                        method: "DELETE"
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        reorder: builder.mutation<void, IReorderCategory>({
            invalidatesTags: ["CompanyCategory"],
            query: (model) => {
                try {
                    return {
                        url: `/company/category/reorder/${model.companyId}`,
                        method: "PUT",
                        body: model,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useGetAllQuery, useAddMutation, useEditMutation, useDeleteMutation, useReorderMutation } = apiCompanyCategory;