"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type AnimatedNumberProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  duration = 1.2,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (isInView && !prefersReduced) {
      motionValue.set(value);
    } else if (prefersReduced) {
      motionValue.jump(value);
    }
  }, [isInView, value, prefersReduced, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, suffix, prefix]);

  if (prefersReduced) {
    return <span className={className}>{prefix}{value}{suffix}</span>;
  }

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
