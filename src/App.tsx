import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Toast from "./common/toast";
import { TToastData, TToastType } from "./common/toast/types";
import ToastContext from "./context/toastContext";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";
import Recipes from "./planner/recipes";

const queryClient = new QueryClient();
function App() {
  const [toastList, setToastList] = useState<TToastData[]>([]);

  const removeToast = (id: string | number) => {
    setToastList(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (message: string, type: TToastType = "info", autoClose: boolean = false, autoCloseDuration: number = 3000) => {
    const toast: TToastData = {
      id: Date.now(),
      message,
      type
    };
    setToastList(prev => [...prev, toast]);

    if (autoClose) {
      setTimeout(() => {
        removeToast(toast.id);
      }, autoCloseDuration);
    }
  };

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContext.Provider value={{ toastList, addToast, removeToast }}>
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
          <Toast data={toastList} onRemove={removeToast} />
        </ToastContext.Provider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default App;
