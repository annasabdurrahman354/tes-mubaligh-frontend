import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
  cn,
} from "@heroui/react";
import { useState, useEffect, forwardRef } from "react";
import { PesertaKertosonoVerifikasi} from "@/types/kertosono";
import { ucwords, ucwordsCustom } from "@/libs/helper";

type ParticipantCardProps = {
  peserta: PesertaKertosonoVerifikasi;
  onPress: () => void;
  isVisible?: boolean;
};

const AnimatedPesertaVerifikasiCard = forwardRef<HTMLDivElement, ParticipantCardProps>(
  ({ peserta, onPress, isVisible = true }, ref) => {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
      setShow(isVisible);
    }, [isVisible]);

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
              `bg-default-50 border-small border-default-100`,
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
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )
    );
  },
);

AnimatedPesertaVerifikasiCard.displayName = "AnimatedPesertaVerifikasiCard";

export default AnimatedPesertaVerifikasiCard;
