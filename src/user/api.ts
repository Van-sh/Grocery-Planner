import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readCookie } from "../common/cookieHelper";
import {
  TChangePasswordFormData,
  TChangePasswordResponse,
  TEditUserDetailsFormData,
  TEditUserDetailsResponse,
  TUserResponse,
} from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/auth`,
    prepareHeaders: (headers) => {
      const token = readCookie("auth");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getCurrentUser: build.query<TUserResponse, null>({
      query: () => ({
        url: `/whoami`,
        method: "GET",
      }),
    }),
    changePassword: build.mutation<TChangePasswordResponse, TChangePasswordFormData>({
      query: (body) => ({
        url: "/change-password",
        method: "POST",
        body,
      }),
    }),
    editUserDetails: build.mutation<TEditUserDetailsResponse, TEditUserDetailsFormData>({
      query: (body) => ({
        url: "/edit",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useGetCurrentUserQuery, useChangePasswordMutation, useEditUserDetailsMutation } =
  userApi;
