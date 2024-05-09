import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";

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
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default App;
