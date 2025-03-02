import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Divider,
  Image,
  cn,
} from "@heroui/react";
import { CheckCircle, CircleX, BookOpenCheck } from "lucide-react";
import { useState, useEffect, forwardRef } from "react";

import { PesertaKediri } from "@/types/kediri";
import { PesertaKertosono } from "@/types/kertosono";
import { ucwords, ucwordsCustom } from "@/libs/helper";
import { useAuth } from "@/hooks/use-auth";

type ParticipantCardProps = {
  peserta: PesertaKediri | PesertaKertosono;
  isSelected: boolean;
  onPress: () => void;
  isVisible?: boolean;
};

const AnimatedPesertaCard = forwardRef<HTMLDivElement, ParticipantCardProps>(
  ({ peserta, isSelected, onPress, isVisible = true }, ref) => {
    const [show, setShow] = useState(isVisible);
    const { user } = useAuth();

    useEffect(() => {
      setShow(isVisible);
    }, [isVisible]);

    const getCardColor = () => {
      if (isSelected) return "primary";
      if (peserta.telah_disimak) return "success";

      return "default";
    };

    const handlePress = () => {
      if (!show) {
        setTimeout(onPress, 500);
      } else {
        onPress();
      }
    };

    return (
      show && (
        <motion.div
          ref={ref} // Attach ref here
          layout
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: -20 }}
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 1, 0.5, 1],
            scale: {
              type: "spring",
              damping: 15,
              stiffness: 100,
            },
          }}
        >
          <Card
            fullWidth
            isPressable
            className={cn(
              `bg-${getCardColor()}-50 border-small border-${getCardColor()}-100`,
              "transition-colors duration-200",
            )}
            shadow="sm"
            onPress={handlePress}
          >
            <CardHeader className="py-2.5 px-4 flex-col items-start">
              <div className="flex items-start justify-start gap-2">
                <h3 className="text-large font-semibold">
                  {ucwordsCustom(peserta.nama_lengkap)}
                </h3>
                {peserta.jumlah_penyimakan > 0 && (
                  <Chip
                    className="transition-transform hover:scale-105"
                    color="danger"
                    variant="flat"
                  >
                    {peserta.jumlah_penyimakan}
                  </Chip>
                )}
              </div>
              <p className="text-small font-medium text-default-600">
                {peserta.jenis_kelamin === "L" ? "bin" : "binti"}{" "}
                {peserta.nama_ayah}
              </p>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-row items-center justify-center gap-2 p-3">
              <div className="flex flex-col gap-2 items-center justify-center">
                <Image
                  removeWrapper
                  alt={peserta.nama_lengkap}
                  className="w-18 h-24 rounded-xl border-4 border-default-200 transition-transform hover:scale-105"
                  src={peserta.foto_smartcard}
                />
                <Chip
                  className="transition-colors duration-200"
                  color={peserta.telah_disimak ? "success" : "primary"}
                  variant="faded"
                >
                  {peserta.kelompok}
                  {peserta.nomor_cocard}
                </Chip>
              </div>
              <div className="flex flex-col flex-1 px-2 rounded-lg">
                <div className="flex flex-col gap-1 justify-center text-small">
                  <p className="font-semibold">Pondok:</p>
                  <p className="text-default-600">
                    {ucwordsCustom(peserta.asal_pondok_nama)}
                  </p>
                  <p className="font-semibold">Asal Daerah:</p>
                  <p className="text-default-600">
                    {ucwords(peserta.asal_daerah_nama)}
                  </p>
                  <p className="font-semibold">Umur:</p>
                  <p className="text-default-600">{peserta.umur} Tahun</p>
                  {peserta.telah_disimak && (
                    <Chip
                      className="my-1 transition-all duration-200 hover:scale-105"
                      color={
                        peserta.penilaian_anda === "Lulus"
                          ? "success"
                          : peserta.penilaian_anda === "Tidak Lulus"
                            ? "danger"
                            : "primary"
                      }
                      startContent={
                        peserta.penilaian_anda === "Lulus" ? (
                          <CheckCircle size={18} />
                        ) : peserta.penilaian_anda === "Tidak Lulus" ? (
                          <CircleX size={18} />
                        ) : peserta.avg_nilai ? (
                          <BookOpenCheck size={18} />
                        ) : null
                      }
                      variant="faded"
                    >
                      Nilai Anda:{" "}
                      {peserta.penilaian_anda != undefined
                        ? peserta.penilaian_anda
                        : peserta.akademik?.find(
                              (akademik) => akademik.guru_id == user?.id,
                            )
                          ? Object.entries(
                              peserta.akademik.find(
                                (akademik) => akademik.guru_id == user?.id,
                              ),
                            )
                              .filter(([key, _]) =>
                                [
                                  "nilai_makna",
                                  "nilai_keterangan",
                                  "nilai_penjelasan",
                                  "nilai_pemahaman",
                                ].includes(key),
                              )
                              .reduce((sum, [_, value]) => sum + value, 0) / 4
                          : 0}
                    </Chip>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )
    );
  },
);

AnimatedPesertaCard.displayName = "AnimatedPesertaCard";

export default AnimatedPesertaCard;
