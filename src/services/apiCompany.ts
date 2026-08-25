import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { IRequestCompany } from "@/types/company/IRequestCompany";

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
        })
    })
})

export const { useGetAllRequestCompanyQuery } = apiCompany;