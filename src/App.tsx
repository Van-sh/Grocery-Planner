import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import "./App.css";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";

function App() {
  return (
    <NextUIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Hello world!</div>} />
          <Route path="planner" element={<Planner />}>
            <Route index element={<div>Planner</div>} />
            <Route path="ingredients" element={<Ingredients />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NextUIProvider>
  );
}

export default App;
