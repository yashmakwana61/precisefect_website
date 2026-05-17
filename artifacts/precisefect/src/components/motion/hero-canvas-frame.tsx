import type { ReactNode } from "react";

type HeroCanvasFrameProps = {
  children: ReactNode;
  className?: string;
};

/** Canvas shell — matches page `bg-surface`, borderless. */
export function HeroCanvasFrame({ children, className = "" }: HeroCanvasFrameProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="absolute -inset-4 bg-primary-container/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-80" />
      <div className="relative w-full h-full min-h-[280px] lg:min-h-[320px] overflow-hidden bg-surface [&_canvas]:absolute [&_canvas]:inset-0">
        {children}
      </div>
    </div>
  );
}
