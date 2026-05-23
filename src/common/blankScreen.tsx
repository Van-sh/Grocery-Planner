import { Button } from "@heroui/react";
import { useRandomEmojiRef } from "./useRandomEmoji";

type Props = { name: string; onAdd: () => void };

export default function BlankScreen({ name, onAdd }: Props) {
  const emoji = useRandomEmojiRef();

  return (
    <main className="text-center px-6 py-24">
      <p className="text-7xl">{emoji.current}</p>
      <p className="text-3xl mt-4 font-bold">No {name} found</p>
      <Button className="mt-10" color="primary" onPress={onAdd}>
        Add {name}
      </Button>
    </main>
  );
}
