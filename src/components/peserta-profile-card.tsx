import { Card, CardBody, Chip, Divider, cn, Avatar, Image } from "@heroui/react";
import {
  CheckCircle,
  CircleX,
  Clock,
  GraduationCap,
  Handshake,
  HeartHandshake,
  MapPinned,
  School,
  Smile,
} from "lucide-react";

import { PesertaKediri } from "@/types/kediri";
import { PesertaKertosono } from "@/types/kertosono";
import { ucwords, ucwordsCustom } from "@/libs/helper";

type PesertaProfileCardProps = {
  peserta: PesertaKediri | PesertaKertosono;
};

const PesertaProfileCard: React.FC<PesertaProfileCardProps> = ({ peserta }) => {
  return (
    <Card
      fullWidth
      className={cn(`border-small dark:border-small border-default-100`)}
    >
      <CardBody className="flex flex-row items-center justify-center gap-2">
        <div className="flex flex-col flex-1 rounded-lg p-2">
          <div className="flex flex-row items-center mb-4">
            <Image
              removeWrapper
              alt={peserta.nama_lengkap}
              className="w-20 h-26 mr-4 rounded-xl border-4 border-default-200 transition-transform hover:scale-105"
              src={peserta.foto_smartcard}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-large font-semibold">
                  {peserta.nama_lengkap}
                </h3>
              </div>
              <p className="mb-2 text-small font-medium text-default-600">
                {peserta.jenis_kelamin === "L" ? "bin" : "binti"}{" "}
                {peserta.nama_ayah}
              </p>
              <Chip color="primary" variant="faded">
                {peserta.kelompok}
                {peserta.nomor_cocard}
              </Chip>
            </div>
          </div>
          <Divider />
          <div className="flex flex-row flex-wrap gap-2 mt-4 text-small">
            <Chip
              color="primary"
              startContent={<School size={18} />}
              variant="flat"
            >
              {ucwordsCustom(peserta.asal_pondok_nama)}
            </Chip>
            <Chip
              color="primary"
              startContent={<MapPinned size={18} />}
              variant="flat"
            >
              {ucwords(peserta.asal_daerah_nama)}
            </Chip>
            <Chip
              color="primary"
              startContent={<GraduationCap size={18} />}
              variant="flat"
            >
              {ucwordsCustom(peserta.pendidikan)}
            </Chip>
            <Chip
              color="primary"
              startContent={<Clock size={18} />}
              variant="flat"
            >
              {peserta.umur} Tahun
            </Chip>
            <Chip
              color="primary"
              startContent={<Handshake size={18} />}
              variant="flat"
            >
              {ucwords(peserta.status_mondok)}
            </Chip>
            <Chip
              color="primary"
              startContent={<Smile size={18} />}
              variant="flat"
            >
              Hobi {ucwords(peserta.hobi)}
            </Chip>
            {peserta.avg_nilai && (
              <Chip
                color={
                  peserta.hasil_sistem === "Lulus"
                    ? "success"
                    : peserta.hasil_sistem === "Tidak Lulus"
                      ? "danger"
                      : "primary"
                }
                startContent={
                  peserta.hasil_sistem === "Lulus" ? (
                    <CheckCircle size={18} />
                  ) : peserta.hasil_sistem === "Tidak Lulus" ? (
                    <CircleX size={18} />
                  ) : null
                }
                variant="flat"
              >
                Nilai Sementara {Number(peserta.avg_nilai).toFixed(2)}
              </Chip>
            )}
            {peserta.akhlak.length != 0 ? (
              peserta.total_poin_akhlak ? (
                <Chip
                  color="danger"
                  startContent={<HeartHandshake size={18} />}
                  variant="flat"
                >
                  Poin Akhlak {peserta.total_poin_akhlak}
                </Chip>
              ) : (
                <Chip
                  color="danger"
                  startContent={<HeartHandshake size={18} />}
                  variant="flat"
                >
                  Catatan Ketertiban {" " + peserta.akhlak.length}
                </Chip>
              )
            ) : null}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PesertaProfileCard;
