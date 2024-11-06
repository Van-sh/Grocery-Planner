import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type TDishesBase } from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const dishesApi = createApi({
   reducerPath: "dishesApi",
   baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api/dishes` }),
   endpoints: (build) => ({
      //* getDishes
      createDish: build.mutation<TDishesBase, TDishesBase>({
         query: (data) => ({
            url: "",
            method: "POST",
            body: data,
         }),
      }),
      updateDish: build.mutation<TDishesBase, { data: TDishesBase; id: string }>({
         query: ({ data, id }) => ({
            url: `/${id}`,
            method: "PATCH",
            body: data,
         }),
      }),
   }),
});

export const { useCreateDishMutation, useUpdateDishMutation } = dishesApi;
