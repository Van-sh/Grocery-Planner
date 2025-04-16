import { TMeal } from "./edit/types";

export type TCreatePlanBase = {
  name: string;
  isPrivate: boolean;
};

export type TPlansBase = TCreatePlanBase & {
  dishes: TMeal[];
};

export type TPlans = TPlansBase & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TPlansResponse = {
  data: TPlans[];
  count: number;
};

export type TPlanResponse = {
  data: TPlans;
}

export type TPlansGetAllQuery = {
  page: number;
  query: string;
};
