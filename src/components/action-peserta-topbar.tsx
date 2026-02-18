import { useState, useEffect, useRef } from "react";
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
  const [isSidebar, setIsSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPeserta, activePesertaIndex, setActivePesertaIndex, formValues } = usePeserta();

  const tahap = location.pathname.includes("kediri") ? "Kediri" : "Kertosono";
  const action = location.pathname.includes("penilaian-akademik")
    ? "Tes Akademik"
    : location.pathname.includes("penilaian-akhlak")
      ? "Nilai Akhlak"
      : "Detail Peserta";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sidebar behavior: when device is landscape and tablet or smaller (<=1024px),
  // show a fixed left sidebar and push main content to the right by setting
  // document padding. Also hide horizontal scroll to avoid overflow.
  useEffect(() => {
    if (typeof window === "undefined") return;
  const mq = window.matchMedia("(orientation: landscape) and (max-width: 1024px)");

    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches;
  setIsSidebar(matches);
    };

    // initialize
    handle(mq);

    // add listener
    if (mq.addEventListener) {
      mq.addEventListener("change", handle as EventListener);
    } else if ((mq as any).addListener) {
      // older browsers
      (mq as any).addListener(handle);
    }

    return () => {
      try {
        document.documentElement.style.paddingLeft = "";
        document.documentElement.style.overflowX = "";
      } catch (err) {}
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handle as EventListener);
      } else if ((mq as any).removeListener) {
        (mq as any).removeListener(handle);
      }
    };
  }, []);

  // Measure actual aside width and apply document padding when sidebar is active
  const asideRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyPadding = () => {
      try {
        if (isSidebar && asideRef.current) {
          const w = asideRef.current.offsetWidth || 0;
          document.documentElement.style.paddingLeft = `${w + 8}px`; // add small gap
          document.documentElement.style.overflowX = "hidden";
        } else {
          document.documentElement.style.paddingLeft = "";
          document.documentElement.style.overflowX = "";
        }
      } catch (err) {}
    };

    // apply after render
    applyPadding();

    // also update on window resize/orientationchange to be safe
    window.addEventListener("resize", applyPadding);
    window.addEventListener("orientationchange", applyPadding);

    return () => {
      try {
        document.documentElement.style.paddingLeft = "";
        document.documentElement.style.overflowX = "";
      } catch (err) {}
      window.removeEventListener("resize", applyPadding);
      window.removeEventListener("orientationchange", applyPadding);
    };
  }, [isSidebar]);

  if (!mounted) return null;

  // Sidebar version for landscape small/tablet devices
  if (isSidebar) {
    return (
      <aside
        ref={asideRef}
        aria-label="Peserta Sidebar"
        className="fixed left-0 top-0 bottom-0 w-auto bg-background border-r border-default-100 z-40 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex flex-col h-full p-1 gap-2 items-center">
          <div className="w-full flex items-center justify-center">
            <Button
              isIconOnly
              aria-label="Back"
              className="flex-grow-0"
              variant="light"
              onPress={() => navigate(-1)}
            >
              <ArrowLeft />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-3 mt-1">
            <AnimatePresence mode="sync">
              {selectedPeserta.map((peserta, index) => {
                const formValue = formValues.find(f => f.peserta_id === peserta.id);
                return (
                  <BouncingAvatar
                    key={peserta.id}
                    active={index === activePesertaIndex}
                    cocard={peserta.nomor_cocard}
                    kelompok={peserta.kelompok}
                    nama={
                        (peserta.nama_panggilan
                          ? peserta.nama_panggilan
                          : getFirstValidWord(peserta.nama_lengkap)) +
                        (peserta.riwayat_tes > 0 ? "*".repeat(peserta.riwayat_tes) : "")
                      }
                    src={peserta.foto_identitas}
                    onClick={() => setActivePesertaIndex(index)}
                    awal_penilaian={formValue?.awal_penilaian}
                  />
                )
              })}
              <Button
                isIconOnly
                aria-label="Add Peserta"
                color="primary"
                radius="full"
                size="md"
                variant="shadow"
                onPress={() => navigate(-1)}
              >
                <PlusIcon />
              </Button>
            </AnimatePresence>
          </div>
        </div>
      </aside>
    );
  }

  // Default top navbar version
  return (
    <Navbar
      isBordered
      as={"div"}
      classNames={{
        base: "h-fit",
        wrapper: "w-full h-fit flex flex-col py-4",
      }}
      maxWidth="full"
    >
      <NavbarItem className="w-full flex">
        <NavbarContent justify="start">
          <Button
            isIconOnly
            aria-label="Back"
            className="flex-grow-0"
            variant="light"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
        </NavbarContent>
        <NavbarContent justify="center">
          <p className="font-medium text-xl">
            {action} {tahap}
          </p>
        </NavbarContent>
        <NavbarContent />
      </NavbarItem>
      {selectedPeserta.length !== 0 && (
        <>
          <Divider />
          <NavbarItem
            as="div"
            className="w-full flex flex-row justify-center items-center gap-3 min-h-fit flex-wrap"
          >
            <AnimatePresence mode="sync">
              {selectedPeserta.map((peserta, index) => {
                const formValue = formValues.find(f => f.peserta_id === peserta.id);
                return (
                  <BouncingAvatar
                    key={peserta.id}
                    active={index === activePesertaIndex}
                    cocard={peserta.nomor_cocard}
                    kelompok={peserta.kelompok}
                    nama={
                      (peserta.nama_panggilan
                        ? peserta.nama_panggilan
                        : getFirstValidWord(peserta.nama_lengkap)) +
                      (peserta.riwayat_tes > 0 ? "*".repeat(peserta.riwayat_tes) : "")
                    }
                    src={peserta.foto_identitas}
                    onClick={() => setActivePesertaIndex(index)}
                    awal_penilaian={formValue?.awal_penilaian}
                  />
                )
              })}
              <Button
                isIconOnly
                aria-label="Add Peserta"
                color="primary"
                radius="full"
                size="md"
                variant="shadow"
                onPress={() => navigate(-1)}
              >
                <PlusIcon />
              </Button>
            </AnimatePresence>
          </NavbarItem>
        </>
      )}
    </Navbar>
  );
}
