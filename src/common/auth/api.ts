import { CredentialResponse } from "@react-oauth/google";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TLoginResponse, TSigninFormData, TSignupFormData } from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/auth` }),
  endpoints: (build) => ({
    login: build.mutation<TLoginResponse, TSigninFormData>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    signup: build.mutation<TLoginResponse, TSignupFormData>({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),
    google: build.mutation<TLoginResponse, CredentialResponse>({
      query: (credentialResponse) => ({
        url: "/google",
        method: "POST",
        body: credentialResponse,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGoogleMutation } = authApi;
