export type TChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TChangePasswordResponse = {
  data: { message: string };
};
