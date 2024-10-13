import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./common/navbar";
import Planner from "./planner";
import Ingredients from "./planner/ingredients";

const queryClient = new QueryClient();
function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID || ""}>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <NavBar />
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
    </GoogleOAuthProvider>
  );
}

export default App;
