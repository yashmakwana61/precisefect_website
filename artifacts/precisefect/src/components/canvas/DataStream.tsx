import { useEffect, useRef } from "react";
import { clipToCanvas, prefersReducedMotion, setupCanvas } from "./canvas-utils";
import { bindCanvasAnimationLifecycle } from "./canvas-animation";

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  opacity: number;
}

const COLORS = ["rgba(0,23,54,", "rgba(0,200,140,", "rgba(0,80,180,"];
const BLOCK_LABELS = ["Validate", "Transform", "Route", "Persist", "Notify", "Audit"];

type DataStreamProps = {
  className?: string;
  /** Fewer particles and tighter layout for smaller hero frames */
  intensity?: "light" | "normal";
};

export default function DataStream({ className = "", intensity = "normal" }: DataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const particleCount = intensity === "light" ? 14 : 24;
    const trailLen = intensity === "light" ? 8 : 12;

    let { w: W, h: H } = setupCanvas(canvas, ctx);

    const layoutBlocks = (): Block[] => {
      const count = BLOCK_LABELS.length;
      const gap = 10;
      const maxBlockW = Math.min(64, (W - gap * (count + 1)) / count);
      const blockW = Math.max(44, maxBlockW);
      const total = count * blockW + (count - 1) * gap;
      const startX = (W - total) / 2 + blockW / 2;
      const y = H * 0.52;
      return BLOCK_LABELS.map((label, i) => ({
        x: startX + i * (blockW + gap),
        y,
        w: blockW,
        h: 34,
        color: i % 2 === 0 ? "rgba(0,23,54,0.88)" : "rgba(0,200,140,0.88)",
        label,
        opacity: reduced ? 1 : 0,
      }));
    };

    let blocks = layoutBlocks();
    const laneYs = () => [H * 0.22, H * 0.78];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const lanes = laneYs();
      const lane = lanes[i % 2];
      return {
        x: Math.random() * W,
        y: lane + (Math.random() - 0.5) * (H * 0.08),
        speed: 0.7 + Math.random() * 1.1,
        size: 1.5 + Math.random() * 2,
        opacity: 0.25 + Math.random() * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });

    let t = 0;

    function tick() {
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      clipToCanvas(ctx, W, H);
      ctx.clearRect(0, 0, W, H);

      // Lane tracks (above / below pipeline blocks only)
      for (const y of laneYs()) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = "rgba(0,23,54,0.06)";
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Processing blocks (drawn before particles so streams stay in lanes)
      blocks.forEach((b, i) => {
        if (!reduced) b.opacity = Math.min(1, b.opacity + 0.015);
        const phase = (t * 0.015 - i * 0.25) % (Math.PI * 2);
        const pulse = 0.92 + Math.sin(phase) * 0.08;

        ctx.save();
        ctx.globalAlpha = b.opacity * pulse;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 6);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = `bold ${Math.max(7, Math.min(9, b.w / 8))}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.label.toUpperCase(), b.x, b.y);

        if (i < blocks.length - 1) {
          const nb = blocks[i + 1];
          ctx.strokeStyle = "rgba(0,200,140,0.35)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2, b.y);
          ctx.lineTo(nb.x - nb.w / 2, nb.y);
          ctx.stroke();
        }
        ctx.restore();
      });

      // Particles — clipped, short trails, lane-bound
      for (const p of particles) {
        const trail = ctx.createLinearGradient(p.x - trailLen, 0, p.x, 0);
        trail.addColorStop(0, `${p.color}0)`);
        trail.addColorStop(1, `${p.color}${p.opacity})`);
        ctx.fillStyle = trail;
        ctx.fillRect(p.x - trailLen, p.y - p.size / 2, trailLen, p.size);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(0.55, p.opacity + 0.15)})`;
        ctx.fill();

        if (!reduced) {
          p.x += p.speed;
          if (p.x > W + trailLen) p.x = -trailLen;
        }
      }

      ctx.restore();
      t++;
      if (animating) frameRef.current = requestAnimationFrame(tick);
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

    const ro = new ResizeObserver(() => {
      ({ w: W, h: H } = setupCanvas(canvas, ctx));
      blocks = layoutBlocks();
    });
    ro.observe(canvas);

    return () => {
      unbindLifecycle();
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} aria-hidden />;
}
