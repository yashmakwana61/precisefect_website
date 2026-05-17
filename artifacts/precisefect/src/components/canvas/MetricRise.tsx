import { useEffect, useRef } from "react";
import { clipToCanvas, prefersReducedMotion, setupCanvas } from "./canvas-utils";
import { bindCanvasAnimationLifecycle } from "./canvas-animation";

interface Bar {
  label: string;
  shortLabel: string;
  target: number;
  color: string;
  unit: string;
  /** For invoice cycle: starting days before improvement */
  startValue?: number;
}

const BARS: Bar[] = [
  { label: "Order Accuracy", shortLabel: "Order accuracy", target: 99.8, color: "rgba(0,200,140,", unit: "%" },
  { label: "Manual Hours Saved", shortLabel: "Hours saved", target: 2400, color: "rgba(0,23,54,", unit: "h" },
  { label: "Invoice Cycle (days)", shortLabel: "Invoice cycle", target: 1, color: "rgba(0,80,180,", unit: "d", startValue: 8 },
  { label: "Error Reduction", shortLabel: "Error reduction", target: 92, color: "rgba(0,200,140,", unit: "%" },
];

function formatValue(b: Bar, animVal: number): string {
  if (b.unit === "d" && b.startValue != null) {
    const days = b.startValue - animVal * ((b.startValue - b.target) / b.target);
    return `${days.toFixed(1)}${b.unit}`;
  }
  if (b.unit === "h" && animVal >= 1000) return `${(animVal / 1000).toFixed(1)}k${b.unit}`;
  if (b.unit === "%") return `${animVal.toFixed(1)}${b.unit}`;
  return `${animVal.toFixed(animVal < 10 ? 1 : 0)}${b.unit}`;
}

function measureText(ctx: CanvasRenderingContext2D, text: string, font: string) {
  ctx.font = font;
  return ctx.measureText(text).width;
}

export default function MetricRise({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let { w: W, h: H } = setupCanvas(canvas, ctx);
    let t = reduced ? 90 : 0;

    function ease(x: number) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    let animating = false;
    const unbindLifecycle = bindCanvasAnimationLifecycle(canvas, {
      onResume: () => {
        animating = true;
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(tick);
      },
      onPause: () => {
        animating = false;
        cancelAnimationFrame(frameRef.current);
      },
    });

    function tick() {
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      clipToCanvas(ctx, W, H);
      ctx.clearRect(0, 0, W, H);

      const padX = 16;
      const padY = 14;
      const valueColW = 52;
      const gap = 10;
      const labelFont = `600 ${W < 340 ? 8 : 9}px Inter, sans-serif`;
      const valueFont = `bold ${W < 340 ? 11 : 12}px Inter, sans-serif`;

      const labelTexts = BARS.map((b) => (W < 380 ? b.shortLabel : b.label).toUpperCase());
      const maxLabelW = Math.max(...labelTexts.map((t) => measureText(ctx, t, labelFont)), 0);
      const labelW = Math.min(108, Math.max(64, maxLabelW + 4));

      const barX = padX + labelW + gap;
      const valueRight = W - padX;
      const barMaxW = Math.max(48, valueRight - valueColW - gap - barX);
      const rowGap = 10;
      const barH = Math.max(18, (H - padY * 2 - rowGap * (BARS.length - 1)) / BARS.length);
      const progress = Math.min(1, t / 90);

      BARS.forEach((b, i) => {
        const y = padY + i * (barH + rowGap);
        const animVal = ease(progress) * b.target;
        const fillW = Math.min(barMaxW, (animVal / (b.target * 1.05)) * barMaxW);
        const trackY = y + barH * 0.28;
        const trackH = barH * 0.44;
        const midY = y + barH / 2;

        ctx.fillStyle = "rgba(0,23,54,0.7)";
        ctx.font = labelFont;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(labelTexts[i], barX - gap, midY);

        ctx.beginPath();
        ctx.roundRect(barX, trackY, barMaxW, trackH, 4);
        ctx.fillStyle = "rgba(0,23,54,0.06)";
        ctx.fill();

        if (fillW > 0) {
          const grad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
          grad.addColorStop(0, `${b.color}0.4)`);
          grad.addColorStop(1, `${b.color}0.95)`);
          ctx.beginPath();
          ctx.roundRect(barX, trackY, fillW, trackH, 4);
          ctx.fillStyle = grad;
          ctx.fill();

          const capX = Math.min(barX + fillW, barX + barMaxW - 2);
          const glow = ctx.createRadialGradient(capX, midY, 0, capX, midY, 6);
          glow.addColorStop(0, `${b.color}0.3)`);
          glow.addColorStop(1, `${b.color}0)`);
          ctx.beginPath();
          ctx.arc(capX, midY, 6, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        const valStr = formatValue(b, animVal);
        ctx.fillStyle = `${b.color}1)`;
        ctx.font = valueFont;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(valStr, valueRight, midY);
      });

      ctx.restore();
      if (!reduced) t++;
      if (animating) frameRef.current = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => {
      ({ w: W, h: H } = setupCanvas(canvas, ctx));
    });
    ro.observe(canvas);

    return () => {
      unbindLifecycle();
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} aria-hidden />;
}
