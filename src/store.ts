import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "./common/auth/api";
import authSliceReducer from "./common/auth/slice";
import toastSliceReducer from "./common/toast/slice";
import { ingredientsApi } from "./planner/ingredients/api";
import { dishesApi } from "./planner/dishes/api";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    toast: toastSliceReducer,
    authApi: authApi.reducer,
    ingredientsApi: ingredientsApi.reducer,
    dishesApi: dishesApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware, ingredientsApi.middleware, dishesApi.middleware, )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
