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
import { AlertTriangle, CheckCircle, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActionPesertaTopbar from "@/components/action-peserta-topbar";
import EmptyState from "@/components/empty-state";
import PesertaProfileCard from "@/components/peserta-profile-card";
import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import RiwayatAkademikKediriCard from "@/components/riwayat-akademik-kediri-card";
import RiwayatAkhlakKediriCard from "@/components/riwayat-akhlak-kediri-card";
import { usePeserta } from "@/hooks/use-peserta";

export default function DetailPesertaKediriPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("akademik");
  const { selectedPeserta, activePesertaIndex } = usePeserta();

  // Redirect immediately if selectedPeserta is empty or null
  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      navigate("/peserta-kediri?action=detail", { replace: true });
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
              <p className="text-lg">Rata-Rata Nilai</p>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-row flex-wrap gap-2 text-small">
                <Chip color="primary" variant="flat">
                  Makna:{" "}
                  {Number(
                    selectedPeserta[activePesertaIndex].avg_nilai_makna,
                  ).toFixed(2) ?? 0}
                </Chip>
                <Chip color="primary" variant="flat">
                  Keterangan:{" "}
                  {Number(
                    selectedPeserta[activePesertaIndex].avg_nilai_keterangan,
                  ).toFixed(2) ?? 0}
                </Chip>
                <Chip color="primary" variant="flat">
                  Penjelasan:{" "}
                  {Number(
                    selectedPeserta[activePesertaIndex].avg_nilai_penjelasan,
                  ).toFixed(2) ?? 0}
                </Chip>
                <Chip color="primary" variant="flat">
                  Pemahaman:{" "}
                  {Number(
                    selectedPeserta[activePesertaIndex].avg_nilai_pemahaman,
                  ).toFixed(2) ?? 0}
                </Chip>
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex flex-row flex-wrap gap-2 text-small">
                <Chip color="primary" variant="flat">
                  Nilai Akhir:{" "}
                  {Number(
                    selectedPeserta[activePesertaIndex].avg_nilai,
                  ).toFixed(2) ?? 0}
                </Chip>
                <Chip
                  color={
                    selectedPeserta[activePesertaIndex].hasil_sistem === "Lulus"
                      ? "success"
                      : selectedPeserta[activePesertaIndex].hasil_sistem ===
                          "Tidak Lulus Akademik"
                        ? "danger"
                        : selectedPeserta[activePesertaIndex].hasil_sistem ===
                            "Perlu Musyawarah"
                          ? "warning"
                          : "default"
                  }
                  startContent={
                    selectedPeserta[activePesertaIndex].hasil_sistem ===
                    "Lulus" ? (
                      <CheckCircle size={18} />
                    ) : selectedPeserta[activePesertaIndex].hasil_sistem ===
                      "Tidak Lulus" ? (
                      <CircleX size={18} />
                    ) : selectedPeserta[activePesertaIndex].hasil_sistem ===
                      "Perlu Musyawarah" ? (
                      <AlertTriangle size={18} />
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
            onSelectionChange={(key) => setTab(String(key))}
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
                        <RiwayatAkademikKediriCard
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
                        <RiwayatAkhlakKediriCard
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
