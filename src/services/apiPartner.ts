import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { IPartnerLogin } from "@/types/partner/IPartnerLogin";
import type { IPartnerRegister } from "@/types/partner/IPartnerRegister";
import type { IPartnerVerifyCode } from "@/types/partner/IPartnerVerifyCode";
import type { ISendRequestCompany } from "@/types/partner/ISendRequestCompany";
import type { ITokensResponse } from "@/types/token/ITokensResponse";
import type {IPartner} from "@/types/partner/IPartner.ts";

export const apiPartner = createApi({
    reducerPath: "apiPartner",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Partner"],
    endpoints: (builder) => ({
        login: builder.mutation<ITokensResponse, IPartnerLogin>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Partner/Login",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        register: builder.mutation<boolean, IPartnerRegister>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Partner/Register",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        verifyCode: builder.mutation<ITokensResponse, IPartnerVerifyCode>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Partner/VerifyCode",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        logout: builder.mutation<void, void>({
            query: () => {
                try {
                    return {
                        method: "POST",
                        url: "/Partner/Logout",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        getProfile: builder.query<IPartner, void>({
            query: () => {
                try {
                    return {
                        url: "/Partner/GetProfile",
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        sendRequestCompany: builder.mutation<void, ISendRequestCompany>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Partner/send-request-company",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useVerifyCodeMutation, useLogoutMutation, useGetProfileQuery, useSendRequestCompanyMutation } = apiPartner;