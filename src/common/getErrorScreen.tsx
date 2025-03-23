import { Button } from "@nextui-org/react";
import { useRef } from "react";
import { emojis } from "../constants";

type Props = { errorMsg: string; onRetry: () => void };

export default function GetErrorScreen({ errorMsg, onRetry }: Props) {
  const emoji = useRef(emojis[Math.floor(Math.random() * emojis.length)]);

  return (
    <main className="text-center px-6 py-24">
      <p className="text-7xl">{emoji.current}</p>
      <p className="text-3xl mt-4 font-bold">{errorMsg}</p>
      <Button className="mt-10" color="primary" onClick={onRetry}>
        Retry
      </Button>
    </main>
  );
}
