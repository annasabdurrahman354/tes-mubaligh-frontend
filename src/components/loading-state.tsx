import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const LoadingState = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <motion.div
      ref={ref}
      layout // Smooth layout transitions
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center border-medium border-primary-200 border-dashed rounded-3xl py-10 px-16 mx-auto my-auto h-fit w-full"
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
      <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full">
        <Spinner color="primary" size="lg" variant="wave" />
      </div>
      <div className="text-center">
        <h2 className="text-xl text-primary-500 font-medium tracking-tight">
          Loading...
        </h2>
      </div>
    </motion.div>
  );
});

LoadingState.displayName = "LoadingState";

export default LoadingState;
