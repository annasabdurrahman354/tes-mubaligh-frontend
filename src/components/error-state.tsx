import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { CircleX, RotateCcw } from "lucide-react";
import { forwardRef } from "react";

const ErrorState = forwardRef(({ message, onPress }, ref) => {
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
      className="flex flex-col items-center justify-center border-medium border-danger-200 border-dashed rounded-3xl py-10 px-16 mx-auto my-auto h-full w-full"
      layout
    >
      <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full">
        <CircleX className="w-16 h-16 text-danger-400" />
      </div>
      <div className="text-center">
        <h2 className="text-md text-danger-500 font-medium tracking-tight">{message}</h2>
      </div>
      {onPress && (
        <div className="flex items-center justify-center bg-muted rounded-full mt-4">
          <Button color="primary" variant="faded" startContent={<RotateCcw size={16} />} onPress={onPress}>
            Coba Lagi
          </Button>
        </div>
      )}
    </motion.div>
  );
});

ErrorState.displayName = "ErrorState";

export default ErrorState;
