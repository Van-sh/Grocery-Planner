import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readCookie } from "../../common/cookieHelper";
import { TCreatePlanBase } from "../../common/types";
import { TUserResponse } from "../../user/types";
import { TDeleteMeal, TMealBase } from "./edit/types";
import type {
  TPlanResponse,
  TPlansGetAllQuery,
  TPlansResponse,
  TStartPlanRequest,
  TStopPlanRequest,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL;

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
    getPlan: build.query<TPlanResponse, string>({
      query: (id) => `/${id}`,
    }),
    createPlans: build.mutation<TPlanResponse, TCreatePlanBase>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    updatePlans: build.mutation<TPlanResponse, TCreatePlanBase & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deletePlan: build.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    startPlan: build.mutation<TUserResponse, TStartPlanRequest>({
      query: ({ planId, range }) => ({
        url: `/${planId}/start`,
        method: "POST",
        body: { range },
      }),
    }),
    stopPlan: build.mutation<TUserResponse, TStopPlanRequest>({
      query: ({ planId }) => ({
        url: `/${planId}/stop`,
        method: "POST",
      }),
    }),
    deleteMeal: build.mutation<void, TDeleteMeal>({
      query: ({ planId, mealId }) => ({
        url: `/${planId}/meals/${mealId}`,
        method: "DELETE",
      }),
    }),
    updateMeal: build.mutation<TMealBase, TMealBase>({
      query: ({ planId, ...data }) => ({
        url: `/${planId}/meals`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanQuery,
  useCreatePlansMutation,
  useUpdatePlansMutation,
  useDeletePlanMutation,
  useStartPlanMutation,
  useStopPlanMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} = plansApi;
