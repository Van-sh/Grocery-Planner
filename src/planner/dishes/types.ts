import { type TIngredients } from "../ingredients/types";

export type TDishIngredientsBase = {
   ingredient: string;
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

export type TDishes = Omit<TDishesBase, "ingredients"> & {
   _id: string;
   createdAt: string;
   updatedAt: string;
   createdBy: string;
   updatedBy: string;
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
