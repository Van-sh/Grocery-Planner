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

export type TUserResponse = {
  jwt: string;
  data: TUserData;
};
