import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  centered?: boolean;
};

/** Static heading — pair with sectionReveal on a parent OR itemReveal on children, not both. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "mb-20",
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? "text-center mx-auto" : ""} ${className}`}>
      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">
        {eyebrow}
      </p>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">{title}</h2>
      {description && (
        <div className={`mt-6 text-lg text-muted-foreground ${centered ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
          {description}
        </div>
      )}
    </div>
  );
}
