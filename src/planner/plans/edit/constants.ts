import { defaultUser } from "../../../constants";
import { TPlans } from "../types";
import { EMealType } from "./types";

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const mealTypeMap: Record<keyof typeof EMealType, EMealType> = {
  wakeup: EMealType.wakeup,
  breakfast: EMealType.breakfast,
  midmorning: EMealType.midmorning,
  lunch: EMealType.lunch,
  midafternoon: EMealType.midafternoon,
  dinner: EMealType.dinner,
  bedtime: EMealType.bedtime,
};

// mealOrder = ["wakeup", "breakfast", "midmorning", ...] 
export const mealOrder = Object.keys(EMealType) as (keyof typeof EMealType)[];

export const defaultPlan: TPlans = {
  name: "",
  isPrivate: false,
  isActive: true,
  meals: {},
  createdAt: "",
  createdBy: defaultUser,
  updatedAt: "",
  updatedBy: defaultUser,
  _id: "",
};
