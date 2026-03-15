import { mealOrder } from "../../constants";
import { TMeal } from "../types";

export const getSortedMeals = (data: TMeal[]) =>
  [...data].sort((a, b) => mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType));
