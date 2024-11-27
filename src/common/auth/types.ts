export type TUserData = {
  fName: string;
  lName?: string;
  picture?: string;
  email: string;
};

export type TSignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TSigninFormData = {
  email: "",
  password: ""
};

export type TUserResponse = {
  jwt: string;
  data: TUserData;
};

export type TAddUserDetails = {
  userDetails: TUserData;
  jwt: string;
}
