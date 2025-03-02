import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

export const AuthLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative font-inter">
      <main className="container">
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
