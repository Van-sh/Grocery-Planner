import { TPlansBase } from "../types";

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const defaultPlan: TPlansBase = {
  name: "",
  isPrivate: false,
  isActive: true,
  meals: {}
};
