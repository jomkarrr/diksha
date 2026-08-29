"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedProgressBarProps = {
  value: number;
  label?: React.ReactNode;
  shimmer?: boolean;
};

export function AnimatedProgressBar({ value, label, shimmer = false }: AnimatedProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));
  const prefersReduced = useReducedMotion();

  return (
    <div>
      {label ? (
        <div className="mb-2 flex justify-between text-sm text-on-surface-variant">
          {label}
          <span>{width}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
        {prefersReduced ? (
          <div
            className={`h-full rounded-full ${shimmer ? "shimmer" : "bg-[#F4511E]"}`}
            style={{ width: `${width}%` }}
          />
        ) : (
          <motion.div
            className={`h-full rounded-full ${shimmer ? "shimmer" : "bg-[#F4511E]"}`}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        )}
      </div>
    </div>
  );
}
