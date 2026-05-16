export type TLoginData = {
  authSource: "email" | "nonEmail";
  email: string;
  fName: string;
  _id: string;
  lName?: string;
  name: string;
};

export type TCurrentPlan = {
  plan: string | { _id: string; name: string };
  weeks: number;
  startedAt: string;
  endsAt: string;
};

export type TUserData = TLoginData & {
  picture?: string;
  currentPlan?: TCurrentPlan | null;
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
