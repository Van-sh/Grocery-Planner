import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import ConfirmationModal from "../confirmationModal";
import { logOut } from "./slice";

export default function UserMenu() {
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const dispatch = useAppDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  let userName = userDetails?.fName.substring(0, 15);
  if (userName !== userDetails?.fName) {
    userName += "...";
  }

  const showLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const hideLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogOut = () => {
    dispatch(logOut());

    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{ isBordered: true, src: userDetails?.picture }}
            className="transition-transform"
            name={userName}
          />
        </DropdownTrigger>

        <DropdownMenu variant="flat">
          <DropdownItem key="email" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{userDetails?.email}</p>
          </DropdownItem>
          <DropdownItem key="profile">Profile</DropdownItem>
          <DropdownItem key="change-password" href="/user/change-password">
            Change Password
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={showLogoutModal}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <ConfirmationModal
        isModalOpen={isLogoutModalOpen}
        onModalClose={hideLogoutModal}
        onYesClick={handleLogOut}
        message="Are you sure you want to logout?"
      />
    </>
  );
}
