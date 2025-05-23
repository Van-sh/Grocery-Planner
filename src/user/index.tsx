import { Tab, Tabs } from "@nextui-org/react";
import { Key } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function User() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === "/user";
  const pathname = location.pathname.replace("/user/", "");

  const handleSelectionChange = (keyName: Key) => {
    navigate(`/user/${keyName}`);
  };

  return isRootPath ? (
    <Navigate to="change-password" />
  ) : (
    <div className="flex justify-center">
      <div className="max-w-3xl w-full px-6">
        <Tabs selectedKey={pathname} onSelectionChange={handleSelectionChange}>
          <Tab key="profile" title="Profile" />
          <Tab key="change-password" title="Change Password" />
        </Tabs>
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
