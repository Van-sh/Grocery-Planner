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
import { isLoggedIn } from "./auth/helper";
import Login from "./auth/login";
import Signup from "./auth/signup";
import UserMenu from "./auth/userMenu";

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
    label: "Recipes",
    href: "/recipes"
  }
];

// TODO: Add confirmation modal for logout

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const showSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
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
        onClose={() => setIsSignupModalOpen(false)}
        placement="top-center"
        scrollBehavior="outside"
        className="my-1"
        size="lg"
      >
        <ModalContent>
          {() => (
            <ModalBody>
              <Signup onLogin={showLoginModal} onClose={() => setIsSignupModalOpen(false)} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        placement="top-center"
        scrollBehavior="outside"
        className="my-1"
        size="lg"
      >
        <ModalContent>
          {() => (
            <ModalBody>
              <Login onSignup={showSignupModal} onClose={() => setIsLoginModalOpen(false)} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
