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
import User from "./user";
import ChangePassword from "./user/change-password";
import Profile from "./user/profile";

const Planner = lazy(() => import("./planner"));
const Ingredients = lazy(() => import("./planner/ingredients"));
const Dishes = lazy(() => import("./planner/dishes"));
const Plans = lazy(() => import("./planner/plans"));

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
                  <Route path="plans" element={<Plans />} />
                </Route>
                <Route path="user" element={<User />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
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
