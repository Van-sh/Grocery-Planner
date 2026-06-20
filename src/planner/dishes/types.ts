import type { Option } from "../../common/autoComplete";
import type { TUser } from "../../common/types";
import type { TIngredients } from "../ingredients/types";

export type TDishIngredientsBase = {
  ingredient: Option;
  measurement_unit: "" | "cup" | "tablespoon" | "teaspoon" | "gm" | "ml";
  amount: number;
  to?: number; // to: "To" part of a range. For e.g. 3-5 cloves, here 5 is this value.
  isOptional?: boolean;
};

export type TDishesBase = {
  name: string;
  recipe: string;
  ingredients: TDishIngredientsBase[];
  isPrivate?: boolean;
};

export type TDishIngredients = Omit<TDishIngredientsBase, "ingredient"> & {
  ingredient: TIngredients;
};

export type TDishes = Omit<TDishesBase, "ingredients"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: TUser;
  updatedBy: TUser;
  ingredients: TDishIngredients[];
};

export type TDishesResponse = {
  data: TDishes[];
  count: number;
};

export type TDishResponse = {
  data: TDishes;
};

export type TDishesGetAllQuery = {
  page: number;
  query: string;
};
