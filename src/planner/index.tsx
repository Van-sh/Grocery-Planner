import { Outlet } from "react-router-dom";
import NavBar from "./common/navbar";

export default function Planner() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
