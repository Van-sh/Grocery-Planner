import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "./common/loader";
import NavBar from "./common/navbar";
import ProtectedRoute from "./common/protectedRoute";
import Toast from "./common/toast";
import Providers from "./providers";

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
    <BrowserRouter>
      <Providers>
        <NavBar />
        <Suspense fallback={<Loader />}>
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
        <Toast />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
