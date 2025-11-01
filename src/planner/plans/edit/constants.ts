import { defaultUser } from "../../../constants";
import { TPlans } from "../types";

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

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
