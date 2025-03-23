import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@nextui-org/react";
import { useState } from "react";
import { type RootState, useAppDispatch, useAppSelector } from "../store";
import { isLoggedIn } from "./auth/helper";
import Login from "./auth/login";
import Signup from "./auth/signup";
import UserMenu from "./auth/userMenu";
import { closeLoginModal, closeSignupModal, openLoginModal, openSignupModal } from "./auth/slice";
import { createSelector } from "@reduxjs/toolkit";

const menuItems = [
  {
    label: "Dashboard",
    href: ""
  },
  {
    label: "Ingredients",
    href: "/ingredients"
  },
  {
    label: "Dishes",
    href: "/dishes"
  }
];


const selectIsLoginModalOpen = (state: RootState) => state.auth.isLoginModalOpen;
const selectIsSignupModalOpen = (state: RootState) => state.auth.isSignUpModalOpen;

const selectIsAuthModalOpen = createSelector(
  [selectIsLoginModalOpen, selectIsSignupModalOpen],
  (isLoginModalOpen, isSignupModalOpen) => ({
    isLoginModalOpen,
    isSignupModalOpen,
  }),
);

// TODO: Add confirmation modal for logout

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoginModalOpen, isSignupModalOpen } = useAppSelector(selectIsAuthModalOpen);
  const dispatch = useAppDispatch();

  const showSignupModal = () => {
    dispatch(openSignupModal());
  };

  const hideSignupModal = () => {
    dispatch(closeSignupModal());
  };

  const showLoginModal = () => {
    dispatch(openLoginModal());
  };

  const hideLoginModal = () => {
    dispatch(closeLoginModal());
  };

  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
          <NavbarBrand>
            <p className="text-inherit">PLANNER</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map(item => (
            <NavbarMenuItem key={item.label}>
              <Link color={"foreground"} className="w-full" href={`/planner${item.href}`} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>

        <NavbarContent justify="end">
          {isLoggedIn() ? (
            <UserMenu />
          ) : (
            <>
              <NavbarItem>
                <Button color="primary" variant="ghost" onClick={showLoginModal}>
                  Log In
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button color="primary" variant="solid" onClick={showSignupModal}>
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>

      <Modal
        isOpen={isSignupModalOpen}
        onClose={hideSignupModal}
        placement="top-center"
        scrollBehavior="outside"
        className="my-1"
        size="lg"
      >
        <ModalContent>
          {() => (
            <ModalBody>
              <Signup onLogin={showLoginModal} onClose={hideSignupModal} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={hideLoginModal} placement="top-center" scrollBehavior="outside" className="my-1" size="lg">
        <ModalContent>
          {() => (
            <ModalBody>
              <Login onSignup={showSignupModal} onClose={hideLoginModal} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
