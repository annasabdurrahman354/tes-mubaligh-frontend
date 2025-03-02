import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
  Avatar,
  Chip,
  user,
} from "@heroui/react";
import { useRFIDScanner } from '@/libs/rfid-scanner';
import { useLocation } from "react-router-dom";
import { useKediri } from "@/hooks/use-kediri";
import { useState } from "react";
import { useKertosono } from "@/hooks/use-kertosono";
import { usePeserta } from "@/hooks/use-peserta";
import { BookOpenCheck, CheckCircle, CircleX, Clock, GraduationCap, Handshake, Inbox, MapPinned, School, Smile } from "lucide-react";
import { PesertaKediri } from "@/types/kediri";
import { PesertaKertosono } from "@/types/kertosono";
import AnimatedPesertaCard from "./animated-peserta-card";
import { motion } from "framer-motion";
import { ucwords, ucwordsCustom } from "@/libs/helper";

type PesertaType = PesertaKediri | PesertaKertosono;

const PesertaRFIDScanner = () => {
  const location = useLocation();
  const isTahapKediri = location.pathname.includes("kediri");
  const {getPesertaKediriByRFID} = useKediri();
  const {getPesertaKertosonoByRFID} = useKertosono();
  const {addSelectedPeserta} = usePeserta();

  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [newPeserta, setNewPeserta] = useState<PesertaType>()

  const handleScan = async (scannedCode: string) => {
      console.log('RFID scanned:', scannedCode);
      
      try {
        if(isTahapKediri){
          const peserta = await getPesertaKediriByRFID(scannedCode);
          setNewPeserta(peserta)
        }
        else{
          const peserta = await getPesertaKertosonoByRFID(scannedCode);
          setNewPeserta(peserta)
        }
        
      } catch (error) {
        console.error(error);
      }
      if(isOpen) return false;
      onOpen();
  };

  const addPeserta = () => {
    addSelectedPeserta(newPeserta)
    onClose()
  }

  useRFIDScanner(handleScan, {
      length: 10, // Expected barcode length
      timeout: 200 // Reset timeout in milliseconds
  });

  return (
    <Modal isOpen={isOpen} backdrop="blur" placement="center" onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className="flex flex-col gap-1">Smartcard Terdeteksi</ModalHeader>
            <Divider/>
            <ModalBody>
              {newPeserta == null ? 
                <div className="flex flex-col items-center justify-center py-6 px-6 mx-auto my-auto">
                  <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full">
                    <Inbox className="w-16 h-16 text-foreground-400" />
                  </div>
                  <div className="text-center text-foreground-500">
                    <h2 className="text-xl tracking-tight">Smartcard tidak valid!</h2>
                  </div>
                </div>
                :
                <div className="flex flex-col items-center justify-center p-4">
                  <motion.div
                    className="flex flex-col justify-center items-center align-middle gap-3"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    exit={{ scale: 0.5, opacity: 0, y: -10 }}
                  >
                    <Avatar size="lg" isBordered color="success" src={newPeserta.foto_smartcard} />
                    <Chip size="md" color="success" variant="faded">
                      {newPeserta.nama_lengkap} {newPeserta.kelompok ? `- ${newPeserta.kelompok+newPeserta.nomor_cocard}` : `- ${newPeserta.nomor_cocard}` }
                    </Chip>
                    <Divider />
                    <div className="flex flex-row flex-wrap justify-center items-center gap-2 text-small">
                      <Chip color="success" startContent={<School size={18} />} variant="flat">
                        {ucwordsCustom(newPeserta.asal_pondok_nama)}
                      </Chip>
                      <Chip color="success" startContent={<MapPinned size={18} />} variant="flat">
                        {ucwords(newPeserta.asal_daerah_nama)}
                      </Chip>
                      <Chip color="success" startContent={<GraduationCap size={18} />} variant="flat">
                        {ucwordsCustom(newPeserta.pendidikan)}
                      </Chip>
                      <Chip color="success" startContent={<Clock size={18} />} variant="flat">
                        {newPeserta.umur} Tahun
                      </Chip>
                      <Chip color="success" startContent={<Handshake size={18} />} variant="flat">
                        {ucwords(newPeserta.status_mondok)}
                      </Chip>
                      <Chip color="success" startContent={<Smile size={18} />} variant="flat">
                        Hobi {ucwords(newPeserta.hobi)}
                      </Chip>
                      {
                        newPeserta.telah_disimak && 
                        <Chip color="success" startContent={<CheckCircle size={18} />} variant="flat">
                          Telah Anda Simak
                        </Chip>
                      }
                    </div>
                  </motion.div>
                </div>
              }
              
            </ModalBody>
            <Divider/>
            <ModalFooter>
              <Button color="danger" variant="faded" onPress={onClose}>
                  Batal
              </Button>
              {
                newPeserta && 
                <Button color="primary" variant="shadow" onPress={addPeserta}>
                  Tambahkan
                </Button>
              }
            </ModalFooter>
        </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default PesertaRFIDScanner;
