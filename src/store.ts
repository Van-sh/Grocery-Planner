import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import toastSliceReducer from "./common/toast/slice";
import { ingredientsApi } from "./planner/ingredients/api";

export const store = configureStore({
  reducer: {
    toast: toastSliceReducer,
    ingredientsApi: ingredientsApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(ingredientsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
