import { ImageIcon } from "lucide-react";

type HeroImagePlaceholderProps = {
  className?: string;
  label?: string;
};

export function HeroImagePlaceholder({ className = "", label = "Hero image" }: HeroImagePlaceholderProps) {
  return (
    <div className={`relative w-full aspect-video lg:aspect-square max-w-[600px] ml-auto min-h-[280px] ${className}`}>
      <div className="absolute -inset-4 bg-primary-container/20 rounded-full blur-[120px] -z-10" />
      <div className="w-full h-full bg-surface-container-lowest ghost-border p-4 rounded-xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-full h-full bg-surface-container-high rounded-lg border border-border flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <ImageIcon className="w-12 h-12 stroke-[1.25] opacity-50" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">{label}</span>
        </div>
      </div>
    </div>
  );
}
