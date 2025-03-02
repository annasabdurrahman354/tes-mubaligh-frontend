import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import PesertaRFIDScanner from "@/components/peserta-rfid-scanner";
import ActionPesertaTopbar from "@/components/action-peserta-topbar";
import PesertaProfileCard from "@/components/peserta-profile-card";
import { usePeserta } from "@/hooks/use-peserta";

export const PesertaActionLayout = () => {
  const navigate = useNavigate();
  const { selectedPeserta, activePesertaIndex } = usePeserta();

  useEffect(() => {
    if (!selectedPeserta || selectedPeserta.length === 0) {
      if (location.pathname.includes("penilaian-akademik")) {
        navigate("/peserta-kediri?action=penilaian-akademik", {
          replace: true,
        });
      } else if (location.pathname.includes("penilaian-akhlak")) {
        navigate("/peserta-kediri?action=penilaian-akhlak", { replace: true });
      } else {
        navigate("/peserta-kediri?action=detail", { replace: true });
      }
    }
  }, [selectedPeserta]);

  // Prevent rendering until selectedPeserta is valid
  if (!selectedPeserta || selectedPeserta.length === 0) {
    return null; // Optionally render a loading spinner
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter relative">
      <ActionPesertaTopbar />
      <main className="container flex flex-col flex-grow mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 gap-4">
        <PesertaProfileCard peserta={selectedPeserta[activePesertaIndex]} />
        <div className="flex flex-col gap-4">
          <Outlet />
        </div>
      </main>
      <PesertaRFIDScanner />
    </div>
  );
};
