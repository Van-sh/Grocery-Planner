import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TSignupFormData, TUserResponse } from "./types";
import { CredentialResponse } from "@react-oauth/google";

const API_URL = process.env.REACT_APP_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/auth` }),
  endpoints: build => ({
    signup: build.mutation<TUserResponse, TSignupFormData>({
      query: body => ({
        url: "/signup",
        method: "POST",
        body
      })
    }),
    google: build.mutation<TUserResponse, CredentialResponse>({
      query: credentialResponse => ({
        url: "/google",
        method: "POST",
        body: credentialResponse
      })
    })
  })
});

export const { useSignupMutation, useGoogleMutation } = authApi;
