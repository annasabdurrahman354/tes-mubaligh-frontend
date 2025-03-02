import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { HomeBottombar } from "@/components/home-bottombar";
import HomeTopbar from "@/components/home-topbar";
import { usePeserta } from "@/hooks/use-peserta";

export const HomeLayout = () => {
  const { pathname } = useLocation();
  const { clearPeserta, clearSelectedPeserta, clearForm } = usePeserta();

  useEffect(() => {
    clearPeserta();
    clearSelectedPeserta();
    clearForm();
  }, []);

  return (
    <div className="min-h-screen bg-default-100 dark:bg-default-50/25 flex flex-col items-center justify-center relative font-inter">
      <HomeTopbar />
      <main className="container mx-auto max-w-7xl flex-grow px-4 pt-4 md:px-6 md:pt-6 pb-24">
        <motion.div
          key={pathname}
          animate="in"
          initial="initial"
          transition={pageTransition}
          variants={pageVariants}
        >
          <Outlet />
        </motion.div>
      </main>
      <HomeBottombar />
    </div>
  );
};

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "linear",
  duration: 0.5,
};
