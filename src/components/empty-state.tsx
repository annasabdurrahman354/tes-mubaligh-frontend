import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { forwardRef } from "react";

const EmptyState = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.7, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.7, opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
        scale: {
          type: "spring",
          damping: 15,
          stiffness: 100,
        },
      }}
      className="flex flex-col items-center justify-center border-medium border-foreground-300 border-dashed rounded-3xl py-10 px-16 mx-auto my-auto h-full w-full"
      layout // Smooth layout transitions
    >
      <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full">
        <Inbox className="w-16 h-16 text-foreground-400" />
      </div>
      <div className="text-center text-foreground-500">
        <h2 className="text-xl font-medium tracking-tight">Data tidak ditemukan!</h2>
      </div>
    </motion.div>
  );
});

EmptyState.displayName = "EmptyState";

export default EmptyState;
