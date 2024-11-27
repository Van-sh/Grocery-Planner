import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import NavBar from "./common/navbar";
import ProtectedRoute from "./common/protectedRoute";
import Toast from "./common/toast";
import { store } from "./store";

const Planner = lazy(()=>import("./planner"));
const Ingredients = lazy(()=>import("./planner/ingredients"))
const Dishes = lazy(()=>import("./planner/dishes"))

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID || ""}>
      <NextUIProvider>
        <Provider store={store}>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<div>Hello world!</div>} />

              <Route element={<ProtectedRoute />}>
                <Route path="planner" element={<Planner />}>
                  <Route index element={<div>Planner</div>} />
                  <Route path="ingredients" element={<Ingredients />} />
                  <Route path="dishes" element={<Dishes />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
          <Toast />
        </Provider>
      </NextUIProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
