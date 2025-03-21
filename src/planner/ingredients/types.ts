export type TPreparationBase = {
  category: string;
  timeAmount: number;
  timeUnits: "" | "days" | "hours" | "minutes";
};

export type TPreparation = TPreparationBase & {
  _id: string;
};

export type TIngredientsBase = {
  name: string;
  preparations: TPreparationBase[];
};

type TUser = {
  id: string;
  name: string;
  fName: string;
  lName: string;
};

export type TIngredients = TIngredientsBase & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: TUser;
  updatedBy: TUser;
  preparations: TPreparation[];
};

export type TIngredientsResponse = {
  data: TIngredients[];
  count: number;
};

export type TIngredientsGetAllQuery = {
  page: number;
  query: string;
};
