import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./common/navbar";
import ProtectedRoute from "./common/protectedRoute";
import Toast from "./common/toast";
import Providers from "./providers";

const ChangePassword = lazy(() => import("./user/change-password"));
const Dishes = lazy(() => import("./planner/dishes"));
const Ingredients = lazy(() => import("./planner/ingredients"));
const Planner = lazy(() => import("./planner"));
const Profile = lazy(() => import("./user/profile"));
const User = lazy(() => import("./user"));

function App() {
  return (
    <BrowserRouter>
      <Providers>
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
        <Toast />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
