import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./common/navbar";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";
import { useState } from "react";
import { TUserData } from "./common/auth/types";
import UserContext from "./context/userContext";

const queryClient = new QueryClient();
function App() {
  const [userDetails, setUserDetails] = useState<TUserData | undefined>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : undefined
  );

  const logOut = () => {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUserDetails(undefined);
    localStorage.removeItem("user");
  };

  const addUserDetails = (userDetails: TUserData, jwt: string) => {
    document.cookie = `auth=${jwt}`;
    setUserDetails(userDetails);
    localStorage.setItem("user", JSON.stringify(userDetails));
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID || ""}>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={{ userDetails, addUserDetails, logOut }}>
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path="/" element={<div>Hello world!</div>} />
                <Route path="planner" element={<Planner />}>
                  <Route index element={<div>Planner</div>} />
                  <Route path="ingredients" element={<Ingredients />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </UserContext.Provider>
        </QueryClientProvider>
      </NextUIProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
