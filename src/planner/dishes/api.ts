import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readCookie } from "../../common/cookieHelper";
import { TDishesResponse } from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const dishesApi = createApi({
  reducerPath: "dishesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/dishes`,
    prepareHeaders: (headers) => {
        const token = readCookie("auth");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    }
  }),
  endpoints: (build) => ({
    getDishes: build.query<TDishesResponse, void>({
      query: () => "",
    }),
  }),
});

export const { useGetDishesQuery } = dishesApi;
