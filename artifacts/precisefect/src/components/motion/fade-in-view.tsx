import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { sectionReveal } from "@/lib/motion-presets";

type FadeInViewProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Whole block reveal — use for CTAs or content groups, not per list item. */
export function FadeInView({ children, className, delay = 0, ...rest }: FadeInViewProps) {
  return (
    <motion.div className={className} {...sectionReveal(delay)} {...rest}>
      {children}
    </motion.div>
  );
}
