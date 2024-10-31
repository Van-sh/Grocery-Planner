// Code from: https://blog.logrocket.com/how-to-create-custom-toast-component-react/#selecting-icons-toast-notifications

import { useEffect, useRef } from "react";
import SingleToast from "./singleToast";
import { TToastData } from "./types";

type Props = {
  data: TToastData[];
  onRemove: (id: string | number) => void;
};

export default function Toast({ data, onRemove }: Props) {
  const listRef = useRef(null);

  const handleScrolling = (el: null | HTMLElement) => {
    if (el) {
      el.scrollTo(0, el.scrollHeight);
    }
  };

  useEffect(() => {
    handleScrolling(listRef.current);
  }, [data]);

  return (
    <div className="fixed p-4 w-full max-w-md max-h-screen overflow-x-hidden overflow-y-auto z-10 top-16 right-0" ref={listRef}>
      {data.map(({ id, message, type }, index) => (
        <SingleToast key={id} message={message} type={type} index={index} onClose={() => onRemove(id)} />
      ))}
    </div>
  );
}
