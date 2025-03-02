import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useIsFirstRender = () => {
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
    }
  }, [isFirst]);

  return isFirst;
};

// Smooth spring animation configuration
const pageVariants = {
  initial: { 
    opacity: 0,
    y: 8,
    scale: 0.98
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier easing
      when: "beforeChildren",
      staggerChildren: 0.1,
      opacity: { duration: 0.55 },
      y: { 
        type: "spring",
        damping: 20,
        stiffness: 100
      },
      scale: { 
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1] // Custom spring-like curve
      }
    }
  },
  exit: { 
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.5,
      ease: [0.43, 0, 0.53, 1],
      opacity: { duration: 0.25 }
    }
  }
};

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const isFirstRender = useIsFirstRender();
  
  const getRouteGroup = (pathname: string) => {
    if (pathname === '/' || pathname.startsWith('/statistik') || pathname.startsWith('/akun')) {
      return 'home';
    }
    if (pathname.startsWith('/peserta-kediri')) {
      return 'peserta-kediri';
    }
    if (pathname.startsWith('/peserta-kertosono')) {
      return 'peserta-kertosono';
    }
    if (pathname.startsWith('/login')) {
      return 'auth';
    }
    return pathname;
  };

  const [prevGroup, setPrevGroup] = useState(getRouteGroup(location.pathname));
  const currentGroup = getRouteGroup(location.pathname);
  
  useEffect(() => {
    if (currentGroup !== prevGroup) {
      setPrevGroup(currentGroup);
    }
  }, [currentGroup, prevGroup]);

  const shouldAnimate = isFirstRender || currentGroup !== prevGroup;

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformOrigin: 'center center'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;