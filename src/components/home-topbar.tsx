import { useState, useEffect } from "react";
import {
  Avatar,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
  Image,
} from "@heroui/react";

import { useAuth } from "@/hooks/use-auth";

export default function HomeTopbar() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand className="min-w-min">
        <Image className="h-9 w-9" src="/logo.png" />
        <div className="ml-2 min-w-min">
          <p className="text-inherit font-notoarabic">
          السلام عليكم ورحمة الله وبركاته
          </p>
          <p className="font-medium text-foreground/60">{user?.nama}</p>
        </div>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem />
      </NavbarContent>
      <NavbarContent className="max-w-min" justify="end">
        <NavbarItem>
          <Avatar
            isBordered
            className="cursor-pointer"
            color="primary"
            src={user?.foto}
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
