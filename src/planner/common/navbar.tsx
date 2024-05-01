import { Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link } from "@nextui-org/react";
import { useState } from "react";

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

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
        <NavbarBrand>
          <p className="font-bold text-inherit">PLANNER</p>
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
    </Navbar>
  );
}
