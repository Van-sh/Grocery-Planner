import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "./common/auth/api";
import authSliceReducer from "./common/auth/slice";
import toastSliceReducer from "./common/toast/slice";
import { dishesApi } from "./planner/dishes/api";
import { ingredientsApi } from "./planner/ingredients/api";
import { plansApi } from "./planner/plans/api";
import { userApi } from "./user/api";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    toast: toastSliceReducer,
    authApi: authApi.reducer,
    dishesApi: dishesApi.reducer,
    ingredientsApi: ingredientsApi.reducer,
    plansApi: plansApi.reducer,
    userApi: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dishesApi.middleware,
      ingredientsApi.middleware,
      plansApi.middleware,
      userApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
