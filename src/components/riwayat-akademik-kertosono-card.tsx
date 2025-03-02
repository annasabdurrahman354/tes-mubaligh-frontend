import { motion } from "framer-motion";
import { Card, CardBody, Divider, cn, Avatar, Chip } from "@heroui/react";
import { CheckCircle } from "lucide-react";

import { AkademikKertosono } from "@/types/kertosono";

type RiwayatAkademikKertosonoCardProps = {
  akademik: AkademikKertosono;
};

const RiwayatAkademikKertosonoCard: React.FC<
  RiwayatAkademikKertosonoCardProps
> = ({ akademik }) => {
  return (
    <motion.div
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      initial={{ scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }} // Custom cubic bezier for smooth motion
    >
      <Card
        fullWidth
        className={cn(`border-small dark:border-small border-default-100`)}
      >
        <CardBody className="flex flex-row items-center justify-center gap-2">
          <div className="flex flex-col flex-1 rounded-lg p-2 gap-2">
            <div className="flex flex-row items-center">
              <Avatar
                className="mr-4"
                color="primary"
                size="sm"
                src={akademik.guru_foto}
              />
              <div>
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-small font-semibold">
                    {akademik.guru_nama}
                  </h3>
                  <p className="mb-2 text-xs text-default-500">
                    {akademik.created_at}
                  </p>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col flex-wrap gap-2 text-small">
              {akademik.catatan ? (
                <p className="mb-2 text-small text-default-600">
                  {akademik.catatan}
                </p>
              ) : (
                <p className="mb-2 text-small text-default-600">
                  Tidak ada catatan penilaian.
                </p>
              )}
              <p className="mb-2 text-small text-default-500">
                {`Durasi ${akademik.durasi_penilaian} menit`}
              </p>
              {akademik.rekomendasi_penarikan && (
                <Chip
                  color="success"
                  startContent={<CheckCircle size={18} />}
                  variant="faded"
                >
                  Direkomendasikan
                </Chip>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default RiwayatAkademikKertosonoCard;
