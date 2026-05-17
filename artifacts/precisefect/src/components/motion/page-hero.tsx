import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { heroCopy, heroVisual, heroVisualCentered } from "@/lib/motion-presets";

type PageHeroProps = {
  children: ReactNode;
  visual: ReactNode;
  visualCentered?: boolean;
  className?: string;
};

/** Standard two-column hero — only mount animations, never whileInView. */
export function PageHero({ children, visual, visualCentered = false, className = "" }: PageHeroProps) {
  const visualProps = visualCentered ? heroVisualCentered : heroVisual;

  return (
    <section className={`py-24 md:py-32 bg-surface relative overflow-hidden ${className}`}>
      <motion.div className="max-w-[1440px] mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...heroCopy}>{children}</motion.div>
        <motion.div
          {...visualProps}
          className="relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto min-h-[280px]"
        >
          {visual}
        </motion.div>
      </motion.div>
    </section>
  );
}
