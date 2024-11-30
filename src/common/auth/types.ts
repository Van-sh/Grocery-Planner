export type TUserData = {
  authSource: "email" | "nonEmail";
  email: string;
  fName: string;
  id: string;
  lName?: string;
  name: string;
  picture?: string;
};

export type TSignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TSigninFormData = {
  email: "";
  password: "";
};

export type TUserResponse = {
  jwt: string;
  data: TUserData;
};

export type TAddUserDetails = {
  userDetails: TUserData;
  jwt: string;
};
