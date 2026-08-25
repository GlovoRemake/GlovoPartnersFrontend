import {configureStore} from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import { apiPartner } from "@/services/apiPartner";
import { apiCompany } from "@/services/apiCompany";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiPartner.reducerPath]: apiPartner.reducer,
        [apiCompany.reducerPath]: apiCompany.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat(apiPartner.middleware).concat(apiCompany.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch