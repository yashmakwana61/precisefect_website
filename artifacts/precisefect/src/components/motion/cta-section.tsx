import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { sectionReveal } from "@/lib/motion-presets";

type CtaSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  variant?: "surface" | "primary" | "muted";
  className?: string;
};

export function CtaSection({
  eyebrow,
  title,
  description,
  children,
  variant = "primary",
  className = "",
}: CtaSectionProps) {
  const bg =
    variant === "primary"
      ? "bg-primary text-white"
      : variant === "muted"
        ? "bg-surface-container-lowest border-y border-border"
        : "bg-surface text-center";

  return (
    <section className={`py-32 ${bg} ${className}`}>
      <motion.div
        className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-3xl text-center"
        {...sectionReveal()}
      >
        {eyebrow && (
          <p
            className={`text-xs font-bold tracking-[0.2em] uppercase mb-6 ${
              variant === "primary" ? "text-on-primary-container" : "text-on-primary-container"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`text-4xl md:text-5xl font-bold tracking-tight mb-8 ${
            variant === "primary" ? "text-white" : "text-primary"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`text-lg mb-12 ${
              variant === "primary" ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        )}
        {children}
      </motion.div>
    </section>
  );
}
