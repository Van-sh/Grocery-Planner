import { Outlet } from "react-router-dom";
import { useAppSelector } from "../store";
import AuthErrorScreen from "./auth/authErrorScreen";

export default function ProtectedRoute() {
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const isLoggedIn = !!userDetails;

  return isLoggedIn ? <Outlet /> : <AuthErrorScreen />;
}
