import {configureStore} from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import { apiPartner } from "@/services/apiPartner";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiPartner.reducerPath]: apiPartner.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat(apiPartner.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch