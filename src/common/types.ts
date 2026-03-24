import { days, EMealType } from "../constants";
import { Option } from "./autoComplete";

export type TUser = {
  id: string;
  name: string;
  fName: string;
  lName: string;
};

export type TDays = (typeof days)[number];

export type TMealDishBase = {
  dish: Option;
};

export type MealTypeKey = keyof typeof EMealType;

export type TMeal = {
  mealType: MealTypeKey;
  name: string;
  dishes: TMealDishBase[];
};

export type TCreatePlanBase = {
  name: string;
  isPrivate: boolean;
  isActive: boolean;
};

export type TPlansBase = TCreatePlanBase & {
  meals: { [K in TDays]?: TMeal[] };
};

export type TPlans = TPlansBase & {
  _id: string;
  createdAt: string;
  createdBy: TUser;
  updatedAt: string;
  updatedBy: TUser;
};
