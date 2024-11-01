import { NextUIProvider } from "@nextui-org/react";
import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Toast from "./common/toast";
import { store } from "./store";

const Planner = lazy(()=>import("./planner"));
const Ingredients = lazy(()=>import("./planner/ingredients"))
const Dishes = lazy(()=>import("./planner/dishes"))

function App() {
  return (
    <NextUIProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<div>Hello world!</div>} />
            <Route path="planner" element={<Planner />}>
              <Route index element={<div>Planner</div>} />
              <Route path="ingredients" element={<Ingredients />} />
              <Route path="dishes" element={<Dishes />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toast />
      </Provider>
    </NextUIProvider>
  );
}

export default App;
