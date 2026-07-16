import { useRef } from "react";
import { emojis } from "../constants";

export function useRandomEmojiRef() {
  const emoji = useRef<string | null>(null);
  if (emoji.current === null) {
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
