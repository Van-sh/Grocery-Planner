// Code from: https://blog.logrocket.com/how-to-create-custom-toast-component-react/#selecting-icons-toast-notifications

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import SingleToast from "./singleToast";
import { removeToast } from "./slice";

export default function Toast() {
  const data = useAppSelector(state => state.toast.toastList);
  const dispatch = useAppDispatch();
  const listRef = useRef(null);

  const handleScrolling = (el: null | HTMLElement) => {
    if (el) {
      el.scrollTo(0, el.scrollHeight);
    }
  };

  const handleRemove = (id: string | number) => {
    dispatch(removeToast({ id }));
  };

  useEffect(() => {
    handleScrolling(listRef.current);
  }, [data]);

  return data.length ? (
    <div className="fixed p-4 w-full max-w-md max-h-screen overflow-x-hidden overflow-y-auto z-10 top-16 right-0" ref={listRef}>
      {data.map(({ id, message, type }, index) => (
        <SingleToast key={id} message={message} type={type} index={index} onClose={() => handleRemove(id)} />
      ))}
    </div>
  ) : null;
}
