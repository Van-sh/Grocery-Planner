import { TPlans } from "../../common/types";

export type TPlansResponse = {
  data: TPlans[];
  count: number;
};

export type TPlanResponse = {
  data: TPlans;
};

export type TPlansGetAllQuery = {
  page: number;
  query: string;
};
