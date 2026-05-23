import { Button } from "@heroui/react";
import { useRandomEmojiRef } from "./useRandomEmoji";

type Props = { errorMsg: string; onRetry: () => void };

export default function GetErrorScreen({ errorMsg, onRetry }: Props) {
  const emoji = useRandomEmojiRef();

  return (
    <main className="text-center px-6 py-24">
      <p className="text-7xl">{emoji.current}</p>
      <p className="text-3xl mt-4 font-bold">{errorMsg}</p>
      <Button className="mt-10" color="primary" onPress={onRetry}>
        Retry
      </Button>
    </main>
  );
}
