import type { IRegion } from "@/types/admin/IRegion";
import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiAdmin = createApi({
    reducerPath: "apiAdmin",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Region"],
    endpoints: (builder) => ({
        getRegions: builder.query<IRegion[], void>({
            query: () => ({
                url: "/admin/regions",
                method: "GET",
            }),
            providesTags: ["Region"],
        }),
    })
})

export const { useGetRegionsQuery } = apiAdmin;