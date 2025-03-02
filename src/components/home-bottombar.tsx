import * as React from "react";
import { motion } from "framer-motion";
import { NavLink, useMatch } from "react-router-dom";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import { Home, User, BarChart3 } from "lucide-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  gradient: string;
  iconColor: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Beranda",
    href: "/",
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    label: "Statistik",
    href: "/statistik",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: <User className="h-5 w-5" />,
    label: "Akun",
    href: "/akun",
    gradient:
      "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-red-500",
  },
];

// Variants for the flip animation on the front face
const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

// Variants for the back face of the button
const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

// Variant for the glowing radial background
const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

// Variant for the overall navbar glow (applied behind all items)
const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

// Wrap NavLink with motion so we can animate it.
const MotionNavLink = motion(NavLink);

interface AnimatedNavbarItemProps {
  item: MenuItem;
}

function AnimatedNavbarItem({ item }: AnimatedNavbarItemProps) {
  // Determine if the current route matches this item (active state)
  const match = useMatch({ path: item.href, end: true });
  const isActive = !!match;

  return (
    <motion.div
      className="block rounded-xl overflow-visible group relative"
      style={{ perspective: "600px" }}
      whileHover="hover"
      initial="initial"
      // If active, force the animation state to "hover" so the gradient stays visible.
      animate={isActive ? "hover" : undefined}
    >
      {/* Glowing animated background */}
      <motion.div
        animate={isActive ? "hover" : undefined}
        className="absolute inset-0 z-0 pointer-events-none"
        initial="initial"
        style={{
          background: item.gradient,
          opacity: 0,
          borderRadius: "16px",
        }}
        variants={glowVariants}
      />
      {/* Front Face */}
      <MotionNavLink
        className="flex flex-col items-center justify-center w-full h-full py-2 relative z-10 bg-transparent text-muted-foreground transition-colors rounded-xl"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center bottom",
        }}
        to={item.href}
        transition={sharedTransition}
        variants={itemVariants}
      >
        <span
          className={`transition-colors duration-300 ${
            isActive ? item.iconColor : "text-foreground"
          } group-hover:${item.iconColor}`}
        >
          {item.icon}
        </span>
        <span
          className={`text-sm mt-1 transition-colors duration-300 ${
            isActive ? item.iconColor : "text-foreground"
          } group-hover:${item.iconColor}`}
        >
          {item.label}
        </span>
      </MotionNavLink>
      {/* Back Face */}
      <MotionNavLink
        className="flex flex-col items-center justify-center w-full h-full py-2 absolute inset-0 z-10 bg-transparent text-muted-foreground transition-colors rounded-xl"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center top",
          rotateX: 90,
        }}
        to={item.href}
        transition={sharedTransition}
        variants={backVariants}
      >
        <span
          className={`transition-colors duration-300 ${
            isActive ? item.iconColor : "text-foreground"
          } group-hover:${item.iconColor}`}
        >
          {item.icon}
        </span>
        <span
          className={`text-sm mt-1 transition-colors duration-300 ${
            isActive ? item.iconColor : "text-foreground"
          } group-hover:${item.iconColor}`}
        >
          {item.label}
        </span>
      </MotionNavLink>
    </motion.div>
  );
}

export function HomeBottombar() {
  return (
    <Navbar
      isBlurred
      className="fixed border-small dark:border-foreground-100 bottom-4 left-1/2 -translate-x-1/2 rounded-2xl max-w-[94%] lg:max-w-[98%] w-full p-0 shadow-md overflow-hidden"
      position="static"
    >
      {/* Animated background glow for the entire navbar */}
      <motion.div
        className={`absolute -inset-2 bg-gradient-radial from-transparent via-blue-400/20 via-30% via-purple-400/20 via-60% via-red-400/20 via-90% dark:via-blue-400/30 dark:via-30% dark:via-purple-400/30 dark:via-60% dark:via-red-400/30  dark:via-90% to-transparent rounded-3xl pointer-events-none`}
        variants={navGlowVariants}
      />
      <NavbarContent className="w-screen p-0 relative z-10">
        {menuItems.map((item) => (
          <NavbarItem key={item.label} className="flex-1">
            <AnimatedNavbarItem item={item} />
          </NavbarItem>
        ))}
      </NavbarContent>
    </Navbar>
  );
}
