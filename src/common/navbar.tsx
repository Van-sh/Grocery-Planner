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
import Signup from "./signup";

const menuItems = [
  {
    label: "Dashboard",
    href: ""
  },
  {
    label: "Ingredients",
    href: "/ingredients"
  }
];

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
          <NavbarItem>
            <Button color="primary" variant="ghost" onClick={showLoginModal}>
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" variant="solid" onClick={showSignupModal}>
              Sign Up
            </Button>
          </NavbarItem>
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
              Login
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
