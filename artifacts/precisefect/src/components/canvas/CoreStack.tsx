import { useEffect, useRef } from "react";
import { clipToCanvas, prefersReducedMotion, setupCanvas } from "./canvas-utils";
import { bindCanvasAnimationLifecycle } from "./canvas-animation";

const LAYERS = [
  { label: "Finance", color: "rgba(0,23,54,", width: 1 },
  { label: "Inventory", color: "rgba(0,80,180,", width: 0.78 },
  { label: "Operations", color: "rgba(0,200,140,", width: 0.55 },
];

/** Unified ERP module stack — for ERP service hero. */
export default function CoreStack({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let { w: W, h: H } = setupCanvas(canvas, ctx);
    let t = reduced ? 120 : 0;

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

      const pad = 28;
      const barH = 36;
      const gap = 16;
      const maxW = W - pad * 2;
      const progress = Math.min(1, t / 80);

      LAYERS.forEach((layer, i) => {
        const y = pad + i * (barH + gap);
        const targetW = maxW * layer.width;
        const w = targetW * (0.3 + 0.7 * progress * (1 - i * 0.08));
        const rx = 8;

        ctx.beginPath();
        ctx.roundRect(pad, y, maxW, barH, rx);
        ctx.fillStyle = "rgba(0,23,54,0.06)";
        ctx.fill();

        if (w > 4) {
          const grad = ctx.createLinearGradient(pad, 0, pad + w, 0);
          grad.addColorStop(0, `${layer.color}0.35)`);
          grad.addColorStop(1, `${layer.color}0.92)`);
          ctx.beginPath();
          ctx.roundRect(pad, y, w, barH, rx);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(layer.label.toUpperCase(), pad + 14, y + barH / 2);
      });

      ctx.fillStyle = "rgba(0,23,54,0.45)";
      ctx.font = "600 9px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("UNIFIED CORE", W - pad, H - pad);

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
