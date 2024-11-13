import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store";

export default function ProtectedRoute() {
  const userDetails = useAppSelector(state => state.auth.userDetails);
  const isLoggedIn = !!userDetails;

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}
