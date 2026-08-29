"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Returns true when the user prefers reduced motion.
 * All motion primitives must check this and render static content when true.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
