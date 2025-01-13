import { Button } from "@nextui-org/react";
import { useRef } from "react";
import { emojis } from "../../constants";
import { useAppDispatch } from "../../store";
import { openSignupModal } from "./slice";

type Props = { errorMsg?: string };
const defaultErrorMsg = "Seems like you are not logged in. Please login to continue.";

export default function AuthErrorScreen({ errorMsg = defaultErrorMsg }: Props) {
  const emoji = useRef(emojis[Math.floor(Math.random() * emojis.length)]);
  const dispatch = useAppDispatch();

  const showSignupModal = () => {
    dispatch(openSignupModal());
  };

  return (
    <main className="text-center px-6 py-24">
      <p className="text-7xl">{emoji.current}</p>
      <p className="text-3xl mt-4 font-bold">{errorMsg}</p>
      <Button className="mt-10" color="primary" onClick={showSignupModal}>
        Login
      </Button>
    </main>
  );
}
