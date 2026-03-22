import { HeroUIProvider } from "@heroui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { useHref, useNavigate } from "react-router-dom";
import { store } from "./store";

export default function Providers({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID || ""}>
        <Provider store={store}>{children}</Provider>
      </GoogleOAuthProvider>
    </HeroUIProvider>
  );
}
