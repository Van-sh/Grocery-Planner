import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TIngredientsBase, TIngredientsGetAllQuery, TIngredientsResponse } from "./types";
import { readCookie } from "../../common/cookieHelper";

const API_URL = process.env.REACT_APP_API_URL;

export const ingredientsApi = createApi({
  reducerPath: "ingredientsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/ingredients`,
    prepareHeaders: (headers) => {
      const token = readCookie("auth");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: build => ({
    getIngredients: build.query<TIngredientsResponse, TIngredientsGetAllQuery>({
      query: query => {
        const searchQueries = new URLSearchParams({ page: query.page.toString() });
        if (query.query) searchQueries.append("q", query.query);

        return `?${searchQueries.toString()}`;
      }
    }),
    createIngredient: build.mutation<TIngredientsBase, TIngredientsBase>({
      query: data => ({
        url: "",
        method: "POST",
        body: data
      })
    }),
    updateIngredient: build.mutation<TIngredientsBase, { data: TIngredientsBase; id: string }>({
      query: ({ data, id }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data
      })
    }),
    deleteIngredient: build.mutation<void, string>({
      query: id => ({
        url: `/${id}`,
        method: "DELETE"
      })
    })
  })
});

export const { useLazyGetIngredientsQuery, useGetIngredientsQuery, useCreateIngredientMutation, useUpdateIngredientMutation, useDeleteIngredientMutation } =
  ingredientsApi;
