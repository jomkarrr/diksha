"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type StaggerChildrenProps = {
  children: React.ReactNode;
  staggerDelay?: number;
  duration?: number;
  className?: string;
};

const containerVariants = (stagger: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

const childVariants = (duration: number) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: "easeOut" as const },
  },
});

export function StaggerChildren({
  children,
  staggerDelay = 0.08,
  duration = 0.4,
  className,
}: StaggerChildrenProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Wrap each direct child of StaggerChildren with this for the stagger effect. */
export function StaggerItem({
  children,
  className,
  duration = 0.4,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={childVariants(duration)} className={className}>
      {children}
    </motion.div>
  );
}
