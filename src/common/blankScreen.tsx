import { Button } from "@nextui-org/react";
import { useRef } from "react";

type Props = { name: string; onAdd: () => void };

const emojis = [
  "😕",
  "🫤",
  "😟",
  "🙁",
  "☹️",
  "😮",
  "😯",
  "😲",
  "😳",
  "🥺",
  "🥹",
  "😦",
  "😧",
  "😨",
  "😰",
  "😥",
  "😢",
  "😭",
  "😱",
  "😖",
  "😣",
  "😞",
  "😓",
  "😩",
  "😫"
];

export default function BlankScreen({ name, onAdd }: Props) {
  const emoji = useRef(emojis[Math.floor(Math.random() * emojis.length)]);

  return (
    <main className="text-center px-6 py-24">
      <p className="text-7xl">{emoji.current}</p>
      <p className="text-3xl mt-4 font-bold">No {name} found</p>
      <Button className="mt-10" color="primary" onClick={onAdd}>
        Add {name}
      </Button>
    </main>
  );
}
