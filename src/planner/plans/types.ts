import { TUser } from "../../common/types";
import { TDays, TMeal } from "./edit/types";

export type TCreatePlanBase = {
  name: string;
  isPrivate: boolean;
  isActive: boolean;
};

export type TPlansBase = TCreatePlanBase & {
  meals: { [K in TDays]?: TMeal[] };
};

export type TPlans = TPlansBase & {
  _id: string;
  createdAt: string;
  createdBy: TUser;
  updatedAt: string;
  updatedBy: TUser;
};

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
