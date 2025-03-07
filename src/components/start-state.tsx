import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { forwardRef } from "react";

const StartState = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <motion.div
      ref={ref}
      layout // Smooth layout transitions
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center border-medium  border-primary-100 border-dashed rounded-3xl py-10 px-16 mx-auto my-auto h-full w-full"
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
      <div className="flex items-center justify-center w-20 h-20 rounded-full">
        <Sparkles className="w-16 h-16 text-primary-500" />
      </div>
      <div className="text-center text-primary-300">
        <h2 className="text-lg font-medium tracking-tight">
          Ketik nama atau nomor cocard untuk memulai!
        </h2>
      </div>
    </motion.div>
  );
});

StartState.displayName = "StartState";

export default StartState;
