import { CredentialResponse } from "@react-oauth/google";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TSigninFormData, TSignupFormData, TUserResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/auth` }),
  endpoints: (build) => ({
    login: build.mutation<TUserResponse, TSigninFormData>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    signup: build.mutation<TUserResponse, TSignupFormData>({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),
    google: build.mutation<TUserResponse, CredentialResponse>({
      query: (credentialResponse) => ({
        url: "/google",
        method: "POST",
        body: credentialResponse,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGoogleMutation } = authApi;
