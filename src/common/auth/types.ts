export type TLoginData = {
  authSource: "email" | "nonEmail";
  email: string;
  fName: string;
  _id: string;
  lName?: string;
  name: string;
};

export type TUserData = TLoginData & {
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

export type TLoginResponse = {
  jwt: string;
  data: TLoginData;
};

export type TAddUserDetails = {
  userDetails?: TUserData;
  jwt?: string;
};
