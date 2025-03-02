import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  cn,
  Divider,
  Tab,
  Tabs,
} from "@heroui/react";
import { CheckCircle, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActionPesertaTopbar from "@/components/action-peserta-topbar";
import EmptyState from "@/components/empty-state";
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkademikKertosonoCard from "@/components/riwayat-akademik-kertosono-card";
import RiwayatAkhlakKertosonoCard from "@/components/riwayat-akhlak-kertosono-card";
import { usePeserta } from "@/hooks/use-peserta";

export default function DetailPesertaKertosonoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("akademik");
  const { selectedPeserta, activePesertaIndex } = usePeserta();

  // Redirect immediately if selectedPeserta is empty or null
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      navigate("/peserta-kertosono?action=detail", { replace: true });
    }
  }, [selectedPeserta, navigate]);

  // Don't render anything if redirecting
  if (!selectedPeserta || selectedPeserta.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter relative">
      <ActionPesertaTopbar />
      <main className="container flex flex-col flex-grow mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 gap-4">
        <PesertaProfileCard peserta={selectedPeserta[activePesertaIndex]} />
        <div className="flex flex-col">
          <Card
            fullWidth
            className={cn(`border-small dark:border-small border-default-100`)}
          >
            <CardHeader className="flex flex-col items-start">
              <p className="text-lg">Hasil Pengetesan</p>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-row flex-wrap gap-2 text-small">
                <Chip
                  color={
                    selectedPeserta[activePesertaIndex].penilaian_anda ===
                    "Lulus"
                      ? "success"
                      : selectedPeserta[activePesertaIndex].penilaian_anda ===
                          "Tidak Lulus"
                        ? "danger"
                        : "default"
                  }
                  startContent={
                    selectedPeserta[activePesertaIndex].penilaian_anda ===
                    "Lulus" ? (
                      <CheckCircle size={18} />
                    ) : selectedPeserta[activePesertaIndex].penilaian_anda ===
                      "Tidak Lulus" ? (
                      <CircleX size={18} />
                    ) : null
                  }
                  variant="flat"
                >
                  Penilaian Anda:{" "}
                  {selectedPeserta[activePesertaIndex].penilaian_anda ??
                    "Belum Anda Nilai"}
                </Chip>
                {selectedPeserta[activePesertaIndex].penilaian_anda ===
                  "Lulus" &&
                  selectedPeserta[activePesertaIndex].rekomendasi_anda ===
                    true && (
                    <Chip
                      color="success"
                      startContent={<CheckCircle size={18} />}
                      variant="flat"
                    >
                      Anda Merekomendasikan
                    </Chip>
                  )}
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex flex-row flex-wrap gap-2 text-small">
                <Chip color="primary" variant="flat">
                  Jumlah Meluluskan:{" "}
                  {selectedPeserta[activePesertaIndex].count_akademik_lulus}
                </Chip>
                <Chip color="primary" variant="flat">
                  Jumlah Tidak Meluluskan:{" "}
                  {
                    selectedPeserta[activePesertaIndex]
                      .count_akademik_tidak_lulus
                  }
                </Chip>
                <Chip
                  color={
                    selectedPeserta[activePesertaIndex].hasil_sistem === "Lulus"
                      ? "success"
                      : selectedPeserta[activePesertaIndex].hasil_sistem ===
                          "Tidak Lulus Akademik"
                        ? "danger"
                        : "default"
                  }
                  startContent={
                    selectedPeserta[activePesertaIndex].hasil_sistem ===
                    "Lulus" ? (
                      <CheckCircle size={18} />
                    ) : selectedPeserta[activePesertaIndex].penilaian_anda ===
                      "Tidak Lulus" ? (
                      <CircleX size={18} />
                    ) : null
                  }
                  variant="flat"
                >
                  {selectedPeserta[activePesertaIndex].hasil_sistem}
                </Chip>
              </div>
            </CardFooter>
          </Card>
          <Tabs
            fullWidth
            aria-label="Tabs form"
            classNames={{
              tabList: "mt-4",
            }}
            color="primary"
            selectedKey={tab}
            size="md"
            variant="bordered"
            onSelectionChange={setTab}
          >
            <Tab key="akademik" title="Akademik">
              <Card
                fullWidth
                className={cn(
                  `border-small dark:border-small border-default-100`,
                )}
              >
                <CardBody className="overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {selectedPeserta[activePesertaIndex].akademik.map(
                      (akademik) => (
                        <RiwayatAkademikKertosonoCard
                          key={akademik.id}
                          akademik={akademik}
                        />
                      ),
                    )}
                    {selectedPeserta[activePesertaIndex].akademik.length ==
                      0 && <EmptyState />}
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="akhlak" title="Akhlak">
              <Card
                fullWidth
                className={cn(
                  `border-small dark:border-small border-default-100`,
                )}
              >
                <CardBody className="overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {selectedPeserta[activePesertaIndex].akhlak.map(
                      (akhlak) => (
                        <RiwayatAkhlakKertosonoCard
                          key={akhlak.id}
                          akhlak={akhlak}
                        />
                      ),
                    )}
                    {selectedPeserta[activePesertaIndex].akhlak.length == 0 && (
                      <EmptyState />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </main>
      <PesertaRFIDScanner />
    </div>
  );
}
