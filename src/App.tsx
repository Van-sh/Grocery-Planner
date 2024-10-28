import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

const Planner = lazy(()=>import("./planner"));
const Ingredients = lazy(()=>import("./planner/ingredients"))
const Dishes = lazy(()=>import("./planner/dishes"))

const queryClient = new QueryClient()
function App() {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default App;
