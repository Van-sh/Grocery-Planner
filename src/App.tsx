import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { TUserData } from "./common/auth/types";
import NavBar from "./common/navbar";
import Toast from "./common/toast";
import { TToastData, TToastType } from "./common/toast/types";
import ToastContext from "./context/toastContext";
import UserContext from "./context/userContext";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";
import Recipes from "./planner/recipes";

const queryClient = new QueryClient();
function App() {
  const [toastList, setToastList] = useState<TToastData[]>([]);
  const [userDetails, setUserDetails] = useState<TUserData | undefined>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : undefined
  );

  const removeToast = (id: string | number) => {
    setToastList(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (message: string, type: TToastType = "info", autoClose: boolean = false, autoCloseDuration: number = 3000) => {
    const toast: TToastData = {
      id: Date.now(),
      message,
      type
    };
    setToastList(prev => [...prev, toast]);

    if (autoClose) {
      setTimeout(() => {
        removeToast(toast.id);
      }, autoCloseDuration);
    }
  };

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
            <ToastContext.Provider value={{ toastList, addToast, removeToast }}>
              <BrowserRouter>
                <NavBar />
                <Routes>
                  <Route path="/" element={<div>Hello world!</div>} />
                  <Route path="planner" element={<Planner />}>
                    <Route index element={<div>Planner</div>} />
                    <Route path="ingredients" element={<Ingredients />} />
                    <Route path="recipes" element={<Recipes />} />
                  </Route>
                </Routes>
              </BrowserRouter>
              <Toast data={toastList} onRemove={removeToast} />
            </ToastContext.Provider>
          </UserContext.Provider>
        </QueryClientProvider>
      </NextUIProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
