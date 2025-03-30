import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readCookie } from "../../common/cookieHelper";
import { TPlansGetAllQuery, TPlansResponse } from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/plans`,
    prepareHeaders: (headers) => {
      const token = readCookie("auth");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getPlans: build.query<TPlansResponse, TPlansGetAllQuery>({
      query: (query) => {
        const searchQueries = new URLSearchParams({ page: query.page.toString() });
        if (query.query) searchQueries.append("q", query.query);

        return `?${searchQueries.toString()}`;
      },
    }),
  }),
});

export const { useGetPlansQuery } = plansApi;
