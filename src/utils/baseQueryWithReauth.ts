import {
    type BaseQueryApi,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
    type FetchBaseQueryMeta,
    type QueryReturnValue,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import APP_ENV from "./env";
import {
    logout,
} from "@/store/slices/authSlice";

import type {ApiResponse} from "@/types/api/ApiResponse";

interface CustomFetchArgs extends FetchArgs {
    meta?: {
        isBlob?: boolean;
    };
}

type BaseQueryResult = QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    FetchBaseQueryMeta
>;

const baseQuery = fetchBaseQuery({
    baseUrl: `${APP_ENV.API_URL}/api`,
    credentials: "include",
});

let refreshPromise: Promise<BaseQueryResult> | null = null;

let redirecting = false;

export const baseQueryWithReauth: BaseQueryFn<
    string | CustomFetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const isBlob =
        typeof args !== "string" &&
        args.meta?.isBlob === true;

    let result = await baseQuery(
        isBlob
            ? {
                ...args,
                responseHandler: (response) => response.blob(),
            }
            : args,
        api,
        extraOptions
    );

    if (result.error?.status !== 401) {
        return normalizeResult(result, isBlob);
    }

    const isRefreshRequest =
        typeof args !== "string" &&
        args.url.includes("/Partner/Refresh");

    if (isRefreshRequest) {
        logoutAndRedirect(api);
        return result;
    }

    if (!refreshPromise) {
        refreshPromise = Promise.resolve(
            baseQuery(
                {
                    url: "/Partner/Refresh",
                    method: "POST",
                },
                api,
                extraOptions
            )
        );

        refreshPromise.finally(() => {
            refreshPromise = null;
        });
    }

    const refreshResult = await refreshPromise;

    const refreshData = refreshResult.data as
        | ApiResponse<unknown>
        | undefined;

    if (!refreshData?.isSuccess) {
        logoutAndRedirect(api);

        return {
            error: {
                status: 401,
                data: "Refresh token expired",
            },
        };
    }

    result = await baseQuery(args, api, extraOptions);

    return normalizeResult(result, isBlob);
};

function normalizeResult(
    result: BaseQueryResult,
    isBlob: boolean
): BaseQueryResult {
    if (isBlob) return result;

    if (!result.data) return result;

    const response = result.data as ApiResponse<unknown>;

    if (
        typeof response === "object" &&
        response !== null &&
        "isSuccess" in response
    ) {
        if (!response.isSuccess) {
            return {
                error: {
                    status: 400,
                    data: response.errors,
                },
            };
        }

        return {
            data: response.value,
        };
    }

    return result;
}

async function logoutAndRedirect(
    api: BaseQueryApi
): Promise<void> {
    if (redirecting) {
        return;
    }

    redirecting = true;

    try {
        await baseQuery(
            {
                url: "/Partner/Logout",
                method: "POST",
            },
            api,
            {}
        );
    } finally {
        api.dispatch(logout());

        if (typeof window === "undefined") {
            // eslint-disable-next-line no-unsafe-finally
            return;
        }

        window.location.replace("/auth/login");
    }
}