import { emojis } from "../constants";
import { useLazyRef } from "./useLazyRef";

export function useRandomEmojiRef() {
  const emoji = useLazyRef(() => emojis[Math.floor(Math.random() * emojis.length)]);

  return emoji;
}
