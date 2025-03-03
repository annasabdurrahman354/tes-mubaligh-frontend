import { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { ArrowLeft, PlusIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import BouncingAvatar from "./bouncing-avatar";

import { usePeserta } from "@/hooks/use-peserta";
import { getFirstValidWord } from "@/types/kertosono";

export default function ActionPesertaTopbar() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPeserta, activePesertaIndex, setActivePesertaIndex } =
    usePeserta();

  const tahap = location.pathname.includes("kediri") ? "Kediri" : "Kertosono";
  const action = location.pathname.includes("penilaian-akademik")
    ? "Tes Akademik"
    : location.pathname.includes("penilaian-akhlak")
      ? "Nilai Akhlak"
      : "Detail Peserta";

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
            {action} {tahap}
          </p>
        </NavbarContent>
        <NavbarContent />
      </NavbarItem>
      {selectedPeserta.length !== 0 && (
        <>
          <Divider />
          <NavbarItem
            as="div"
            className="w-full flex flex-row justify-center items-center gap-3 min-h-fit flex-wrap"
          >
            <AnimatePresence mode="sync">
              {selectedPeserta.map((peserta, index) => (
                <BouncingAvatar
                  key={peserta.id}
                  active={index === activePesertaIndex}
                  cocard={peserta.nomor_cocard}
                  kelompok={peserta.kelompok}
                  nama={
                    peserta.nama_panggilan
                      ? peserta.nama_panggilan
                      : getFirstValidWord(peserta.nama_lengkap)
                  }
                  src={peserta.foto_smartcard}
                  onClick={() => setActivePesertaIndex(index)}
                />
              ))}
              <Button
                isIconOnly
                aria-label="Add Peserta"
                color="primary"
                radius="full"
                size="md"
                variant="shadow"
                onPress={() => navigate(-1)}
              >
                <PlusIcon />
              </Button>
            </AnimatePresence>
          </NavbarItem>
        </>
      )}
    </Navbar>
  );
}
