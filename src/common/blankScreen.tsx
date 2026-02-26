import { Button } from "@heroui/react";
import { useState } from "react";
import { emojis } from "../constants";

type Props = { name: string; onAdd: () => void };

export default function BlankScreen({ name, onAdd }: Props) {
  /**
   * This is using a useState instead of a useRef even though it will never cause rerenders because
   * using a useRef as useRef(emojis[Math.floor(Math.random() * emojis.length)])
   * would cause the calculation of Math.floor and Math.random on every rerender.
   * On the other hand, initializer pattern with useState only does the calculation once
   * @link https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
   */
  const [emoji] = useState(() => emojis[Math.floor(Math.random() * emojis.length)]);

  return (
    <main className="text-center px-6 py-24">
      <p className="text-7xl">{emoji}</p>
      <p className="text-3xl mt-4 font-bold">No {name} found</p>
      <Button className="mt-10" color="primary" onClick={onAdd}>
        Add {name}
      </Button>
    </main>
  );
}
