import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Toast from "./common/toast";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";
import Recipes from "./planner/recipes";
import { store } from "./store";

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
              <Route path="recipes" element={<Recipes />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toast />
      </Provider>
    </NextUIProvider>
  );
}

export default App;
