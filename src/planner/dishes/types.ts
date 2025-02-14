import { type TIngredients } from "../ingredients/types";

export type TDishIngredientsBase = {
  ingredient: { id: string; name: string };
  measurement_unit: "" | "cup" | "tablespoon" | "teaspoon" | "gm" | "ml";
  amount: number;
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

type TUser = {
  id: string;
  name: string;
  fName: string;
  lName: string;
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

export type TDishesGetAllQuery = {
  page: number;
  query: string;
};
