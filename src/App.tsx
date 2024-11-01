import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./common/navbar";
import Toast from "./common/toast";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";
import Recipes from "./planner/recipes";
import { store } from "./store";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID || ""}>
      <NextUIProvider>
        <Provider store={store}>
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
          <Toast />
        </Provider>
      </NextUIProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
