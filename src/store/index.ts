import {configureStore} from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import { apiPartner } from "@/services/apiPartner";
import { apiCompany } from "@/services/apiCompany";
import { apiCompanyCategory } from "@/services/apiCompanyCategory";
import { apiCompanyProduct } from "@/services/apiCompanyProduct";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiPartner.reducerPath]: apiPartner.reducer,
        [apiCompany.reducerPath]: apiCompany.reducer,
        [apiCompanyCategory.reducerPath]: apiCompanyCategory.reducer,
        [apiCompanyProduct.reducerPath]: apiCompanyProduct.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat(apiPartner.middleware).concat(apiCompany.middleware).concat(apiCompanyCategory.middleware).concat(apiCompanyProduct.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch