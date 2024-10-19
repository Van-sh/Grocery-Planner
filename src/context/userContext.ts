import { createContext } from "react";
import { TUserData } from "../common/auth/types";

export type TUserContext = {
  userDetails?: TUserData;
  addUserDetails: (userDetails: TUserData, jwt: string) => void;
  logOut: () => void;
};

const UserContext = createContext<TUserContext | null>(null);

export default UserContext;
