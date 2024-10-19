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
import { useContext, useState } from "react";
import UserContext from "../context/userContext";
import Signup from "./auth/signup";

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
  },
];

// TODO: Add confirmation modal for logout
// Show user profile photo on login
// Create logged in user menu

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { userDetails, logOut } = useContext(UserContext)!;

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

        {userDetails ? (
          <NavbarContent justify="end">
            <div>User menu</div>
            <NavbarItem>
              <Button color="primary" variant="solid" onClick={logOut}>
                Log Out
              </Button>
            </NavbarItem>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
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
          </NavbarContent>
        )}
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
        <ModalContent>{() => <ModalBody>Login</ModalBody>}</ModalContent>
      </Modal>
    </>
  );
}
