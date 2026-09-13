import type { IAffiliate } from "@/types/company/affiliate/IAffiliate";
import type { ICreateAffiliate } from "@/types/company/affiliate/ICreateAffiliate";
import type { IGetAffiliate } from "@/types/company/affiliate/IGetAffiliate";
import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type {IPagedRes} from "@/types/api/IPagedRes.ts";
import type {IUpdateAffiliate} from "@/types/company/affiliate/IUpdateAffiliate.ts";
import type {ICategory} from "@/types/companyCategory/ICategory.ts";
import type {IProduct} from "@/types/product/IProduct.ts";
import type { IAddManager } from "@/types/company/manager/IAddManager";
import type { IDeleteManager } from "@/types/company/manager/IDeleteManager";
import type { IAddEmployee } from "@/types/company/employee/IAddEmployee";
import type { IDeleteEmployee } from "@/types/company/employee/IDeleteEmployee";
import type { IPartner } from "@/types/partner/IPartner";

export const apiAffiliate = createApi({
    reducerPath: "apiAffiliate",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Affiliate", "AffiliateCategories", "AffiliateProducts", "AffiliateManagers", "AffiliateEmployees"],
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

        // managers
        addManager: builder.mutation<void, IAddManager>({
            invalidatesTags: ["AffiliateManagers"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/manager/${model.affiliateId}`,
                        method: "POST",
                        body: {
                            partnerEmail: model.partnerEmail
                        }
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        deleteManager: builder.mutation<void, IDeleteManager>({
            invalidatesTags: ["AffiliateManagers"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/manager/${model.affiliateId}`,
                        method: "DELETE",
                        body: {
                            partnerEmail: model.partnerEmail
                        }
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        getManager: builder.query<IPartner[] | null, string>({
            providesTags: ["AffiliateManagers"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/manager/${model}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),

        // employee
        addEmployee: builder.mutation<void, IAddEmployee>({
            invalidatesTags: ["AffiliateEmployees"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/employee/${model.affiliateId}`,
                        method: "POST",
                        body: {
                            partnerEmail: model.partnerEmail
                        }
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        deleteEmployee: builder.mutation<void, IDeleteEmployee>({
            invalidatesTags: ["AffiliateEmployees"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/employee/${model.affiliateId}`,
                        method: "DELETE",
                        body: {
                            partnerEmail: model.partnerEmail
                        }
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        getEmployee: builder.query<IPartner[], string>({
            providesTags: ["AffiliateEmployees"],
            query: (model) => {
                try {
                    return {
                        url: `company/affiliate/employee/${model}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useGetByIdQuery, useGetAllQuery, useAddMutation, useUpdateMutation,
               useGetAffiliateCategoriesQuery, useAddAffiliateCategoryMutation, useRemoveAffiliateCategoryMutation,
               useGetAffiliateProductsQuery, useAddAffiliateProductsMutation, useRemoveAffiliateProductsMutation,
               useGetManagerQuery, useAddManagerMutation, useDeleteManagerMutation,
               useGetEmployeeQuery, useAddEmployeeMutation, useDeleteEmployeeMutation} = apiAffiliate;