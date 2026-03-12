import { days } from "./constants";

export enum EMealType {
  "wakeup" = "Wake Up",
  "breakfast" = "Breakfast",
  "midmorning" = "Mid Morning",
  "lunch" = "Lunch",
  "midafternoon" = "Mid Afternoon Snack",
  "dinner" = "Dinner",
  "bedtime" = "Bed Time",
}

export type MealTypeKey = keyof typeof EMealType;

export type TMeal = {
  mealType: MealTypeKey;
  name: string;
  dishes: TMealDishBase[];
};

export type TDays = (typeof days)[number];

export type TMealDishBase = {
  dish: { _id: string; name: string };
};

export type TCreateMealBase = {
  mealType: EMealType | string;
  dishes: TMealDishBase[];
  isPrivate?: boolean;
};

export type TMealBase = TCreateMealBase & {
  day: TDays;
  planId: string;
};
