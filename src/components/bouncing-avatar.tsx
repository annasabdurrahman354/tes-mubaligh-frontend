import { motion } from "framer-motion";
import { Avatar, Chip } from "@heroui/react";
import { useEffect, useState } from "react";
import SmallTimer from "./timer-small";

// BouncingAvatar Component
interface AvatarProps {
  src: string;
  nama: string;
  kelompok: string;
  cocard: number;
  active?: boolean;
  onClick?: () => void;
  isVisible?: boolean;
  awal_penilaian?: Date; // The prop for the timer
}

const BouncingAvatar: React.FC<AvatarProps> = ({
  src,
  nama,
  kelompok,
  cocard,
  active,
  onClick,
  isVisible = true, // Default to visible
  awal_penilaian,
}) => {
  // Local state to handle visibility
  const [show, setShow] = useState(isVisible);

  // Update local state when prop changes
  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  return (
    show && (
      <motion.div
        animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
        className="flex flex-col justify-center items-center align-middle gap-1.5"
        exit={{ scale: 0.5, opacity: 0, y: -10 }}
        initial={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
      >
        <Avatar isBordered color="primary" size="md" src={src} />
        <Chip color="primary" size="sm" variant={active ? "solid" : "bordered"}>
          {nama} {kelompok ? `- ${kelompok + cocard}` : `- ${cocard}`}
        </Chip>
        {awal_penilaian && (
            <SmallTimer datetimeOrMinutes={awal_penilaian} />
        )}
      </motion.div>
    )
  );
};

export default BouncingAvatar;