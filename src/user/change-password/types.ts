import { TUserData } from "../../common/auth/types";

export type TChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TChangePasswordResponse = {
  message: string;
};

export type TEditUserDetailsFormData = {
  firstName?: string;
  lastName?: string;
  oldEmail: string;
  email?: string;
  picture?: string;
};

export type TEditUserDetailsResponse = {
  message: string;
  data: TUserData;
};
