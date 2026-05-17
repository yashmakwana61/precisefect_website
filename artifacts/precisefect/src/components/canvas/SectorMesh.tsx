import { useEffect, useRef } from "react";
import { clipToCanvas, prefersReducedMotion, setupCanvas } from "./canvas-utils";
import { bindCanvasAnimationLifecycle } from "./canvas-animation";

const SECTORS = ["MFG", "Retail", "Logistics", "Pharma"];
const NAVY = "rgba(0,23,54,";
const MINT = "rgba(0,200,140,";

/** Four-quadrant sector mesh with hub routing — for Industries hero. */
export default function SectorMesh({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let { w: W, h: H } = setupCanvas(canvas, ctx);

    const hub = () => ({ x: W / 2, y: H / 2 });
    const nodes = () => [
      { x: W * 0.22, y: H * 0.22, label: SECTORS[0] },
      { x: W * 0.78, y: H * 0.22, label: SECTORS[1] },
      { x: W * 0.22, y: H * 0.78, label: SECTORS[2] },
      { x: W * 0.78, y: H * 0.78, label: SECTORS[3] },
    ];

    const packets = [0.1, 0.35, 0.6, 0.85];

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

      const center = hub();
      const ns = nodes();

      // Subtle grid
      ctx.strokeStyle = `${NAVY}0.05)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Hub to sector lines
      ns.forEach((n) => {
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = `${NAVY}0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Animated packets along hub spokes
      if (!reduced) {
        packets.forEach((p, i) => {
          const n = ns[i % ns.length];
          const t = (p % 1);
          const px = center.x + (n.x - center.x) * t;
          const py = center.y + (n.y - center.y) * t;
          const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
          g.addColorStop(0, `${MINT}0.85)`);
          g.addColorStop(1, `${MINT}0)`);
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
          packets[i] += 0.004 + i * 0.0005;
        });
      }

      // Sector nodes
      ns.forEach((n, i) => {
        const pulse = 0.5 + Math.sin(Date.now() / 900 + i) * 0.15;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 36 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = `${MINT}${0.06 + pulse * 0.04})`;
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(n.x - 44, n.y - 22, 88, 44, 10);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.strokeStyle = `${NAVY}0.1)`;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `${NAVY}0.8)`;
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label.toUpperCase(), n.x, n.y);
      });

      // Hub
      ctx.beginPath();
      ctx.arc(center.x, center.y, 28, 0, Math.PI * 2);
      ctx.fillStyle = `${NAVY}0.9)`;
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.fillText("HUB", center.x, center.y);

      ctx.restore();
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
