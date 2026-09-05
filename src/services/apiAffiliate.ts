import type { IAffiliate } from "@/types/company/affiliate/IAffiliate";
import type { ICreateAffiliate } from "@/types/company/affiliate/ICreateAffiliate";
import type { IGetAffiliate } from "@/types/company/affiliate/IGetAffiliate";
import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {IPagedRes} from "@/types/api/IPagedRes.ts";
import type {IUpdateAffiliate} from "@/types/company/affiliate/IUpdateAffiliate.ts";
import type {ICategory} from "@/types/companyCategory/ICategory.ts";
import type {IProduct} from "@/types/product/IProduct.ts";

export const apiAffiliate = createApi({
    reducerPath: "apiAffiliate",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Affiliate", "AffiliateCategories", "AffiliateProducts"],
    endpoints: (builder) => ({
        getById: builder.query<IAffiliate, string>({
            providesTags: ['Affiliate'],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/${model}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),

        getAll: builder.query<IPagedRes<IAffiliate, "affiliates">, IGetAffiliate>({
            providesTags: ['Affiliate'],
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
        }),





        getAffiliateCategories: builder.query<ICategory[], string>({
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/categories/${model}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            },
            providesTags: ["AffiliateCategories"]
        }),
        addAffiliateCategory: builder.mutation<void, {affiliateId: string, categoryId: number}>({
            invalidatesTags: ["AffiliateCategories"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/categories/${model.affiliateId}/${model.categoryId}`,
                        method: "POST",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        removeAffiliateCategory: builder.mutation<void, {affiliateId: string, categoryId: number}>({
            invalidatesTags: ["AffiliateCategories"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/categories/${model.affiliateId}/${model.categoryId}`,
                        method: "DELETE",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),


        getAffiliateProducts: builder.query<IProduct[], string>({
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/products/${model}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            },
            providesTags: ["AffiliateProducts"]
        }),
        addAffiliateProducts: builder.mutation<void, {affiliateId: string, productId: number}>({
            invalidatesTags: ["AffiliateProducts"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/products/${model.affiliateId}/${model.productId}`,
                        method: "POST",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        removeAffiliateProducts: builder.mutation<void, {affiliateId: string, productId: number}>({
            invalidatesTags: ["AffiliateProducts"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/products/${model.affiliateId}/${model.productId}`,
                        method: "DELETE",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
    })
})

export const { useGetByIdQuery, useGetAllQuery, useAddMutation, useUpdateMutation,
               useGetAffiliateCategoriesQuery, useAddAffiliateCategoryMutation, useRemoveAffiliateCategoryMutation,
               useGetAffiliateProductsQuery, useAddAffiliateProductsMutation, useRemoveAffiliateProductsMutation} = apiAffiliate;