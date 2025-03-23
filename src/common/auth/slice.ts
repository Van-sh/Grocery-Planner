import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TAddUserDetails, TUserData } from "./types";

type AuthState = {
  userDetails?: TUserData;
  isLoginModalOpen: boolean;
  isSignUpModalOpen: boolean;
};

const initialState: AuthState = {
  userDetails: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : undefined,
  isLoginModalOpen: false,
  isSignUpModalOpen: false,
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
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.isSignUpModalOpen = false;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    openSignupModal: (state) => {
      state.isLoginModalOpen = false;
      state.isSignUpModalOpen = true;
    },
    closeSignupModal: (state) => {
      state.isSignUpModalOpen = false;
    },
    logOut: (state) => {
      state.userDetails = undefined;
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      localStorage.removeItem("user");
    },
  },
});

export const {
  addUserDetails,
  openLoginModal,
  closeLoginModal,
  openSignupModal,
  closeSignupModal,
  logOut,
} = authSlice.actions;
export default authSlice.reducer;
