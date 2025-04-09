import { useState, useEffect } from "react";
import {
  Button,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ActionPesertaVerifikasiTopbar() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const tahap = location.pathname.includes("kediri") ? "Kediri" : "Kertosono";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar
      isBordered
      as={"div"}
      classNames={{
        base: "h-fit",
        wrapper: "w-full h-fit flex flex-col py-4",
      }}
      maxWidth="full"
    >
      <NavbarItem className="w-full flex">
        <NavbarContent justify="start">
          <Button
            isIconOnly
            aria-label="Back"
            className="flex-grow-0"
            variant="light"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
        </NavbarContent>
        <NavbarContent justify="center">
          <p className="font-medium text-xl">
            Verifikasi Peserta {tahap}
          </p>
        </NavbarContent>
        <NavbarContent />
      </NavbarItem>
    </Navbar>
  );
}
