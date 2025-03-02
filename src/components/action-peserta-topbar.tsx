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
  const navigate = useNavigate()
  const {selectedPeserta, activePesertaIndex, setActivePesertaIndex} = usePeserta()

  const tahap = location.pathname.includes("kediri") ? 'Kediri' : 'Kertosono';
  const action = location.pathname.includes("penilaian-akademik") ? 'Tes Akademik' : location.pathname.includes("penilaian-akhlak") ? 'Nilai Akhlak' : 'Detail Peserta';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar as={"div"} isBordered maxWidth="full"  classNames={{
      wrapper: "w-full min-h-min flex flex-col py-4",
    }}>
      <NavbarItem className="w-full flex">
        <NavbarContent justify="start">
          <Button isIconOnly aria-label="Back" variant="light" className="flex-grow-0" onPress={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
        </NavbarContent>
        <NavbarContent justify="center">
          <p className="font-medium text-xl">{action} {tahap}</p>
        </NavbarContent>
        <NavbarContent/>
      </NavbarItem>
      {
        selectedPeserta.length !== 0 && 
        <>
        <Divider/>
        <NavbarItem as="div" className="w-full flex flex-row justify-center items-center gap-3 min-h-fit flex-wrap">
          <AnimatePresence mode="sync">
          {selectedPeserta.map((peserta, index) => (
            <BouncingAvatar 
              key={peserta.id}               
              src={peserta.foto_smartcard} 
              nama={peserta.nama_panggilan ? peserta.nama_panggilan : getFirstValidWord(peserta.nama_lengkap)} 
              kelompok={peserta.kelompok} 
              cocard={peserta.nomor_cocard} 
              active={index === activePesertaIndex}
              onClick={() => setActivePesertaIndex(index)}
            />
          ))}
            <Button isIconOnly aria-label="Add Peserta" color="primary" radius="full" size="md" variant="shadow" onPress={() => navigate(-1)}>
              <PlusIcon />
            </Button>
          </AnimatePresence>        
        </NavbarItem>
        </>
      }
    </Navbar>    
  );
}
