import { createContext } from "react";
import { TToastData, TToastType } from "../common/toast/types";

export type TToastContext = {
  toastList: TToastData[];
  addToast: (message: string, type?: TToastType, autoClose?: boolean, autoCloseDuration?: number) => void;
  removeToast: (id: string | number) => void;
};

const ToastContext = createContext<TToastContext | null>(null);

export default ToastContext;
