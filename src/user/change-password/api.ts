import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readCookie } from "../../common/cookieHelper";
import { TChangePasswordFormData, TChangePasswordResponse } from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/auth`,
    prepareHeaders: headers => {
      const token = readCookie("auth");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: build => ({
    changePassword: build.mutation<TChangePasswordResponse, TChangePasswordFormData>({
      query: body => ({
        url: "/change-password",
        method: "POST",
        body
      })
    })
  })
});

export const { useChangePasswordMutation } = authApi;
