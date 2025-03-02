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
  const {user} = useAuth()

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand className="min-w-min">
        <Image src="/images/logo.png" height={36} className="min-w-min"/>
        <div className="ml-2 min-w-min">
          <p className="text-inherit font-notoarabic">
            ألسلام عليكم ورحمة الله وبركاته
          </p>
          <p className="font-medium text-foreground/60">{user?.nama}</p>
        </div>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem />
      </NavbarContent>
      <NavbarContent justify="end" className="max-w-min">
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
