import { TPlans } from "../../../common/types";
import { defaultUser } from "../../../constants";

export const defaultPlan: TPlans = {
  name: "",
  isPrivate: false,
  meals: {},
  createdAt: "",
  createdBy: defaultUser,
  updatedAt: "",
  updatedBy: defaultUser,
  _id: "",
};
