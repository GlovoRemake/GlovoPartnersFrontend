'use client'

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type {RootState} from "@/store";

interface AuthState {
    accessToken: string | null;
}

const ACCESS_TOKEN_EXPIRED_MIN = 15;
const TOKEN_EXPIRES_DAYS = 7;

const getInitialToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return Cookies.get("accessToken") || null;
};

const initialState: AuthState = {
    accessToken: getInitialToken(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;

            Cookies.set("accessToken", action.payload, {
                expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRED_MIN * 60 * 1000),
                secure: true,
                sameSite: "lax",
            });
        },

        setRefreshToken: (_, action: PayloadAction<string>) => {
            Cookies.set("refreshToken", action.payload, {
                expires: TOKEN_EXPIRES_DAYS,
                secure: true,
                sameSite: "lax",
            });
        },

        logout: (state) => {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");

            state.accessToken = null;
        },
    },
});

export const selectIsAuthenticated = (state: RootState) =>
    Boolean(state.auth.accessToken);

export const selectAccessToken = (state: RootState) =>
    state.auth.accessToken;

export const { setAccessToken, setRefreshToken, logout } = authSlice.actions;
export default authSlice.reducer;