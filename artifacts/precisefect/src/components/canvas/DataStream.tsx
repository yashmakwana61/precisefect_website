import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; speed: number;
  size: number; opacity: number; color: string;
  lane: number;
}

interface Block {
  x: number; y: number; w: number; h: number;
  color: string; label: string; opacity: number;
}

const COLORS = ["rgba(0,23,54,", "rgba(0,200,140,", "rgba(0,80,180,"];
const BLOCK_LABELS = ["Validate", "Transform", "Route", "Persist", "Notify", "Audit"];

export default function DataStream({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const LANES = 5;
    const particles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * W,
      y: (Math.floor(i / 12) / LANES) * H + (H / LANES) * 0.1 + Math.random() * (H / LANES) * 0.8,
      speed: 1.2 + Math.random() * 2,
      size: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      lane: Math.floor(i / 12),
    }));

    const blocks: Block[] = BLOCK_LABELS.map((label, i) => ({
      x: (i / (BLOCK_LABELS.length - 1)) * (W - 80) + 20,
      y: H * 0.5 - 20,
      w: 72, h: 40,
      color: i % 2 === 0 ? "rgba(0,23,54,0.85)" : "rgba(0,200,140,0.85)",
      label, opacity: 0,
    }));

    let t = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Lane tracks
      for (let l = 0; l < LANES; l++) {
        const y = ((l + 0.5) / LANES) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = "rgba(0,23,54,0.06)";
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Particles
      for (const p of particles) {
        const trail = ctx.createLinearGradient(p.x - 20, 0, p.x, 0);
        trail.addColorStop(0, `${p.color}0)`);
        trail.addColorStop(1, `${p.color}${p.opacity})`);
        ctx.fillStyle = trail;
        ctx.fillRect(p.x - 20, p.y - p.size / 2, 20, p.size);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();

        if (!prefersReduced) {
          p.x += p.speed;
          if (p.x > W + 20) p.x = -20;
        }
      }

      // Processing blocks
      blocks.forEach((b, i) => {
        b.opacity = Math.min(1, b.opacity + 0.01);
        const delay = i * 0.3;
        const phase = (t * 0.02 - delay) % (Math.PI * 2);
        const pulse = 0.85 + Math.sin(phase) * 0.15;

        ctx.save();
        ctx.globalAlpha = b.opacity * pulse;
        ctx.fillStyle = b.color;
        const rx = 6;
        ctx.beginPath();
        ctx.roundRect(b.x - b.w / 2, b.y, b.w, b.h, rx);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = `bold 9px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.label.toUpperCase(), b.x, b.y + b.h / 2);

        // Connector arrow to next
        if (i < blocks.length - 1) {
          const nb = blocks[i + 1];
          ctx.strokeStyle = "rgba(0,200,140,0.4)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2, b.y + b.h / 2);
          ctx.lineTo(nb.x - nb.w / 2, nb.y + nb.h / 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      t++;
      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    const ro = new ResizeObserver(() => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      blocks.forEach((b, i) => {
        b.x = (i / (BLOCK_LABELS.length - 1)) * (W - 80) + 20;
        b.y = H * 0.5 - 20;
      });
    });
    ro.observe(canvas);

    return () => { cancelAnimationFrame(frameRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}
