import { useState, useEffect } from "react";
import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
  Image,
} from "@heroui/react";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/use-theme.ts";
import { useAuth } from "@/hooks/use-auth";

export default function HomeTopbar() {
  const [mounted, setMounted] = useState(false);
  const {user, logout} = useAuth()
  const { theme, setDarkTheme, setLightTheme } = useTheme();

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
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Avatar
                isBordered
                as="button"
                className="cursor-pointer"
                color="primary"
                src={user?.foto}
              />
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-2">Theme</h3>
                <div className="flex gap-2 mb-4">
                  <Button
                    color={theme === "light" ? "primary" : "default"}
                    size="sm"
                    startContent={<Sun size={16} />}
                    variant={theme === "light" ? "solid" : "bordered"}
                    onPress={() => setLightTheme()}
                  >
                    Light
                  </Button>
                  <Button
                    color={theme === "dark" ? "primary" : "default"}
                    size="sm"
                    startContent={<Moon size={16} />}
                    variant={theme === "dark" ? "solid" : "bordered"}
                    onPress={() => setDarkTheme()}
                  >
                    Dark
                  </Button>
                </div>
                <Button
                  fullWidth
                  color="danger"
                  startContent={<LogOut size={16} />}
                  variant="flat"
                  onPress={logout}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
