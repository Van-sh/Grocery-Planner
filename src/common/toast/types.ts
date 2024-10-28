export type TToastType = "success" | "error" | "info";
export type TToastData = {
  id: string | number;
  message: string;
  type?: TToastType;
  autoClose?: boolean;
  autoCloseDuration?: number;
};
