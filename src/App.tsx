import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./common/navbar";
import ProtectedRoute from "./common/protectedRoute";
import Toast from "./common/toast";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";
import Recipes from "./planner/recipes";
import { store } from "./store";
import User from "./user";
import ChangePassword from "./user/change-password";

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
                  <Route path="recipes" element={<Recipes />} />
                </Route>
                <Route path="user" element={<User />}>
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="section1" element={<div>Coming Soon...</div>} />
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
