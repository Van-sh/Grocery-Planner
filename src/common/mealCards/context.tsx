import { createContext, useContext } from "react";
import { TPlans } from "../types";

export interface TDataContext {
  data: TPlans;
}

export const DataContext = createContext<TDataContext | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataContextProvider');
  }
  return context;
};
