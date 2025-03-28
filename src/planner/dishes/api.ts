import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readCookie } from "../../common/cookieHelper";
import { type TDishesBase, type TDishesGetAllQuery, type TDishesResponse } from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const dishesApi = createApi({
  reducerPath: "dishesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/dishes`,
    prepareHeaders: (headers) => {
      const token = readCookie("auth");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getDishes: build.query<TDishesResponse, TDishesGetAllQuery>({
      query: (query) => {
        const searchQueries = new URLSearchParams({ page: query.page.toString() });
        if (query.query) searchQueries.append("q", query.query);

        return `?${searchQueries.toString()}`;
      },
    }),
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
    deleteDish: build.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    })
  }),
});

export const { useGetDishesQuery, useCreateDishMutation, useUpdateDishMutation, useDeleteDishMutation } = dishesApi;
