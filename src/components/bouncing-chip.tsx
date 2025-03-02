import { motion } from "framer-motion";
import { Avatar, Chip } from "@heroui/react";
import { useState, useEffect } from "react";

// BouncingChip Component
interface ChipProps {
  src: string;
  nama: string;
  kelompok: string;
  cocard: number;
  onClose?: () => void;
  isVisible?: boolean;
}

const BouncingChip: React.FC<ChipProps> = ({
  src,
  nama,
  kelompok,
  cocard,
  onClose,
  isVisible = true, // Default to visible
}) => {
  // Local state to handle visibility
  const [show, setShow] = useState(isVisible);

  // Handle chip removal
  const handleClose = () => {
    setShow(false);
    // Delay the actual onClose callback until after animation
    setTimeout(() => {
      onClose?.();
    }, 300); // Match animation duration
  };

  // Update local state when prop changes
  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  return (
    show && (
      <motion.div
        animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
        className="flex items-center"
        exit={{ scale: 0.5, opacity: 0, y: -5 }}
        initial={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileTap={{ scale: 0.9 }}
      >
        <Chip
          avatar={<Avatar name={nama} src={src} />}
          color="primary"
          size="lg"
          variant="bordered"
          onClose={handleClose}
        >
          {nama} {kelompok ? (cocard ? `- ${kelompok + cocard}` : "") : ""}
        </Chip>
      </motion.div>
    )
  );
};

export default BouncingChip;
