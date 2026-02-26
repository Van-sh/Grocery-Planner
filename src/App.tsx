import { HeroUIProvider } from "@heroui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./common/navbar";
import ProtectedRoute from "./common/protectedRoute";
import Toast from "./common/toast";
import { store } from "./store";

const ChangePassword = lazy(() => import("./user/change-password"));
const Dishes = lazy(() => import("./planner/dishes"));
const Ingredients = lazy(() => import("./planner/ingredients"));
const Planner = lazy(() => import("./planner"));
const Profile = lazy(() => import("./user/profile"));
const User = lazy(() => import("./user"));

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID || ""}>
      <HeroUIProvider>
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
                <Route path="user" element={<User />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
          <Toast />
        </Provider>
      </HeroUIProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
