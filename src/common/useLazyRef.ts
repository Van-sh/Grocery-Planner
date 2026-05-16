import { useRef, type RefObject } from "react";

export function useLazyRef<T>(initialValFunc: () => T) {
  const ref = useRef<T>(null);
  if (ref.current === null) {
    ref.current = initialValFunc();
  }

  return ref as RefObject<T>;
}
