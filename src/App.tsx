import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./common/navbar";
import ProtectedRoute from "./common/protectedRoute";
import Toast from "./common/toast";
import { store } from "./store";

const ChangePassword = lazy(() => import("./user/change-password"));
const Dishes = lazy(() => import("./planner/dishes"));
const EditPlan = lazy(() => import("./planner/plans/edit"));
const Ingredients = lazy(() => import("./planner/ingredients"));
const Planner = lazy(() => import("./planner"));
const Plans = lazy(() => import("./planner/plans"));
const Profile = lazy(() => import("./user/profile"));
const User = lazy(() => import("./user"));

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID || ""}>
      <NextUIProvider>
        <Provider store={store}>
          <BrowserRouter>
            <NavBar />
            <Suspense>
              <Routes>
                <Route path="/" element={<div>Hello world!</div>} />

                <Route element={<ProtectedRoute />}>
                  <Route path="planner" element={<Planner />}>
                    <Route index element={<div>Planner</div>} />
                    <Route path="ingredients" element={<Ingredients />} />
                    <Route path="dishes" element={<Dishes />} />
                    <Route path="plans">
                      <Route index element={<Plans />} />
                      <Route path="edit/:id" element={<EditPlan />} />
                    </Route>
                  </Route>
                  <Route path="user" element={<User />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="change-password" element={<ChangePassword />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toast />
        </Provider>
      </NextUIProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
