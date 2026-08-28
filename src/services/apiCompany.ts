import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { IRequestCompany } from "@/types/company/IRequestCompany";
import { serialize } from "object-to-formdata";
import type { IUpdateCompany } from "@/types/company/IUpdateCompany";

export const apiCompany = createApi({
    reducerPath: "apiCompany",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Company"],
    endpoints: (builder) => ({
        getAllRequestCompany: builder.query<IRequestCompany[], void>({
            query: () => {
                try {
                    return {
                        url: "/Company/get-my-companies",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        getCompany: builder.query<IRequestCompany, string>({
            query: (companyId) => {
                try {
                    return {
                        url: `/Company/get/${companyId}`,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        updateCompany: builder.mutation<void, IUpdateCompany>({
            query: (model) => {
                try {
                    var formdata = serialize(model);
                    return {
                        url: "/Company/update",
                        method: "POST",
                        body: formdata,
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useGetAllRequestCompanyQuery, useGetCompanyQuery, useUpdateCompanyMutation } = apiCompany;