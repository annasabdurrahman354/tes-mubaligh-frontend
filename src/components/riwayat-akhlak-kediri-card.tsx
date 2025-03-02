import { motion } from "framer-motion";
import { Card, CardBody, Divider, cn, Avatar, Chip } from "@heroui/react";
import { AkhlakKediri } from "@/types/kediri";

type RiwayatAkhlakKediriCardProps = {
  akhlak: AkhlakKediri;
};

const RiwayatAkhlakKediriCard: React.FC<RiwayatAkhlakKediriCardProps> = ({
  akhlak,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }} // Custom cubic bezier for smooth motion
    >
      <Card
        fullWidth
        className={cn(`border-small dark:border-small border-default-100`)}
      >
        <CardBody className="flex flex-row items-center justify-center gap-2">
          <div className="flex flex-col flex-1 rounded-lg p-2 gap-1.5">
            <div className="flex flex-row items-center">
              <Avatar className="mr-4" size="sm" color="primary" src={akhlak.guru_foto} />
              <div>
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-small font-semibold">{akhlak.guru_nama}</h3>
                  <p className="mb-2 text-xs text-default-500">
                    {akhlak.created_at}
                  </p>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col flex-wrap gap-2 text-small">
              {akhlak.catatan ? (
                <p className="text-small text-default-600">
                  {akhlak.catatan}
                </p>
              ) : (
                <p className="text-small text-default-600">
                  Tidak ada catatan penilaian.
                </p>
              )}
              <Chip variant="flat" color="danger">
                Poin: {akhlak.poin}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default RiwayatAkhlakKediriCard;
