import {configureStore, type Middleware} from "@reduxjs/toolkit";
import authReducer, { logout } from "@/store/slices/authSlice";
import { apiPartner } from "@/services/apiPartner";
import { apiCompany } from "@/services/apiCompany";
import { apiCompanyCategory } from "@/services/apiCompanyCategory";
import { apiCompanyProduct } from "@/services/apiCompanyProduct";
import { apiAffiliate } from "@/services/apiAffiliate";
import {apiProductAdditional} from "@/services/apiProductAdditional.ts";
import { apiAdmin } from "@/services/apiAdmin";

const resetApiCacheOnLogout: Middleware = (storeApi) => (next) => (action) => {
    const result = next(action);

    if (logout.match(action)) {
        storeApi.dispatch(apiPartner.util.resetApiState());
        storeApi.dispatch(apiCompany.util.resetApiState());
        storeApi.dispatch(apiCompanyCategory.util.resetApiState());
        storeApi.dispatch(apiCompanyProduct.util.resetApiState());
        storeApi.dispatch(apiAffiliate.util.resetApiState());
        storeApi.dispatch(apiProductAdditional.util.resetApiState());
        storeApi.dispatch(apiAdmin.util.resetApiState());
    }

    return result;
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiPartner.reducerPath]: apiPartner.reducer,
        [apiCompany.reducerPath]: apiCompany.reducer,
        [apiCompanyCategory.reducerPath]: apiCompanyCategory.reducer,
        [apiCompanyProduct.reducerPath]: apiCompanyProduct.reducer,
        [apiAffiliate.reducerPath]: apiAffiliate.reducer,
        [apiProductAdditional.reducerPath]: apiProductAdditional.reducer,
        [apiAdmin.reducerPath]: apiAdmin.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat(apiPartner.middleware)
            .concat(apiCompany.middleware)
            .concat(apiCompanyCategory.middleware)
            .concat(apiCompanyProduct.middleware)
            .concat(apiAffiliate.middleware)
            .concat(apiProductAdditional.middleware)
            .concat(apiAdmin.middleware)
            .concat(resetApiCacheOnLogout)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch