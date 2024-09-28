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

export type TIngredients = TIngredientsBase & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  preparations: TPreparation[];
};

export type TIngredientsResponse = {
  data: TIngredients[];
  count: number;
};

export type TIngredientsGetAllQuery = {
  page: number;
  query: string
};
