import { motion } from "framer-motion";
import { Avatar, Chip } from "@heroui/react";
import { useEffect, useState } from "react";

// BouncingAvatar Component
interface AvatarProps {
  src: string;
  nama: string;
  kelompok: string;
  cocard: number;
  active?: boolean;
  onClick?: () => void;
  isVisible?: boolean;
}

const BouncingAvatar: React.FC<AvatarProps> = ({ 
  src, 
  nama, 
  kelompok,
  cocard, 
  active, 
  onClick,
  isVisible = true // Default to visible
}) => {
  // Local state to handle visibility
  const [show, setShow] = useState(isVisible);

  // Update local state when prop changes
  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  return show && 
    <motion.div
      className="flex flex-col justify-center items-center align-middle gap-3"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      exit={{ scale: 0.5, opacity: 0, y: -10 }}
      onClick={onClick}
    >
      <Avatar size="md" isBordered color="primary" src={src} />
      <Chip size="sm" color="primary" variant={active ? 'solid' : 'bordered'}>
        {nama} {kelompok ? `- ${kelompok+cocard}` : `- ${cocard}` }
      </Chip>
    </motion.div>
};

export default BouncingAvatar;