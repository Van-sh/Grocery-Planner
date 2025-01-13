import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TAddUserDetails, TUserData } from "./types";

type AuthState = {
  userDetails?: TUserData;
};

const initialState: AuthState = {
  userDetails: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : undefined
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUserDetails: (state, { payload }: PayloadAction<TAddUserDetails>) => {
      const { userDetails, jwt } = payload;
      state.userDetails = userDetails;
      document.cookie = `auth=${jwt}`;
      localStorage.setItem("user", JSON.stringify(userDetails));
    },
    logOut: state => {
      state.userDetails = undefined;
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      localStorage.removeItem("user");
    }
  }
});

export const { addUserDetails, logOut } = authSlice.actions;
export default authSlice.reducer;
