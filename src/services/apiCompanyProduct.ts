import type { ICreateProduct } from "@/types/product/ICreateProduct";
import type { IDeleteProduct } from "@/types/product/IDeleteProduct";
import type { IGetCompanyProduct } from "@/types/product/IGetCompanyProduct";
import type { IProduct } from "@/types/product/IProduct";
import type { IUpdateProduct } from "@/types/product/IUpdateProduct";
import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { serialize } from "object-to-formdata";

export const apiCompanyProduct = createApi({
    reducerPath: "apiCompanyProduct",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["CompanyProduct"],
    endpoints: (builder) => ({
        get: builder.query<IProduct[], IGetCompanyProduct>({
            query: (model) => {
                try {
                    return {
                        url: `/company/product/get/${model.companyId}/${model.categoryId}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        add: builder.mutation<void, ICreateProduct>({
            invalidatesTags: ["CompanyProduct"],
            query: (model) => {
                try {
                    var data = serialize(model);
                    return {
                        url: `/company/product/create/${model.companyId}`,
                        method: "POST",
                        body: data,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        update: builder.mutation<void, IUpdateProduct>({
            invalidatesTags: ["CompanyProduct"],
            query: (model) => {
                try {
                    var data = serialize(model);
                    return {
                        url: `/company/product/update/${model.companyId}/${model.productId}`,
                        method: "PUT",
                        body: data,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        delete: builder.mutation<void, IDeleteProduct>({
            invalidatesTags: ["CompanyProduct"],
            query: (model) => {
                try {
                    return {
                        url: `/company/product/delete/${model.companyId}/${model.productId}`,
                        method: "DELETE",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useGetQuery, useAddMutation, useUpdateMutation, useDeleteMutation } = apiCompanyProduct;