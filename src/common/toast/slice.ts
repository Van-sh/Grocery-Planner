import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TToastType = "success" | "error" | "info";

export type TToastData = {
  id: string | number;
  message: string;
  type?: TToastType;
};

export type TAddToastData = {
  message: string;
  type?: TToastType;
  autoClose?: boolean;
  autoCloseDuration?: number;
};

type ToastState = {
  toastList: TToastData[];
};

const initialState: ToastState = {
  toastList: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    removeToast: (state, action: PayloadAction<{ id: string | number }>) => {
      state.toastList = state.toastList.filter((t) => t.id !== action.payload.id);
    },
    addToast: (state, { payload }: PayloadAction<TToastData>) => {
      state.toastList.push(payload);
    },
  },
});

export const addToast = (data: TAddToastData) => (dispatch: any) => {
  const { message, type = "info", autoClose, autoCloseDuration = 3000 } = data;
  const toast: TToastData = { id: Date.now(), message, type };

  dispatch(toastSlice.actions.addToast(toast));

  if (autoClose) {
    setTimeout(() => {
      dispatch(removeToast({ id: toast.id }));
    }, autoCloseDuration);
  }
};

export const { removeToast } = toastSlice.actions;
export default toastSlice.reducer;
