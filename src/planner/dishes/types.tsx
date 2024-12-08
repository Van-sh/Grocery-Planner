import { TIngredientsBase } from "../ingredients/types";

type TIngredient = {
    ingredient: TIngredientsBase;
    measurement_unit: string;
    amount: number;
}

type TUser = {
    id: string;
    name: string;
    fName: string;
    lName: string;
}

export type TDishes = {
    _id: string;
    name: string;
    recipe: string;
    ingredients: TIngredient[];
    isPrivate: boolean;
    createdBy: TUser;
    updatedBy: TUser;
}

export type TDishesResponse = {
    data: TDishes[];
    count: number;
}
