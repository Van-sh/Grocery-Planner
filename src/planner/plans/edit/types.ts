import { TDays, TMealDishBase } from "../../../common/types";
import { EMealType } from "../../../constants";

export type TCreateMealBase = {
  mealType: EMealType | "";
  dishes: TMealDishBase[];
  isPrivate?: boolean;
};

export type TMealBase = TCreateMealBase & {
  day: TDays;
  planId: string;
};
