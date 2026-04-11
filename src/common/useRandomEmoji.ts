import { useRef } from "react";
import { emojis } from "../constants";

export function useRandomEmojiRef() {
  const emoji = useRef("");
  if (!emoji.current) {
    emoji.current =
      emojis[
        Math.floor(
          // eslint-disable-next-line react-hooks/purity
          Math.random() * emojis.length,
        )
      ];
  }
  return emoji;
}
