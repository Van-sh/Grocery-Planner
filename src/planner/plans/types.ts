export type TPlansBase = {
  name: string;
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

export type TPlansGetAllQuery = {
  page: number;
  query: string;
};
