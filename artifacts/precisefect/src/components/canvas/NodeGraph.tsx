import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number; vx: number; vy: number;
  r: number; label: string; pulse: number; pulseDir: number;
}

interface Edge { a: number; b: number; progress: number; speed: number }

const LABELS = ["ERP Core", "Inventory", "Finance", "CRM", "Warehouse", "Dispatch", "API Layer", "Analytics"];
const NAVY = "rgba(0,23,54,";
const MINT = "rgba(0,200,140,";

export default function NodeGraph({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const nodes: Node[] = LABELS.map((label, i) => {
      const angle = (i / LABELS.length) * Math.PI * 2;
      const rx = W * 0.33, ry = H * 0.33;
      return {
        x: W / 2 + Math.cos(angle) * rx * (0.7 + Math.random() * 0.3),
        y: H / 2 + Math.sin(angle) * ry * (0.7 + Math.random() * 0.3),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 28 + Math.random() * 10,
        label,
        pulse: Math.random(),
        pulseDir: 1,
      };
    });

    const edges: Edge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.45) continue;
        edges.push({ a: i, b: j, progress: Math.random(), speed: 0.003 + Math.random() * 0.003 });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Draw edges
      for (const e of edges) {
        const na = nodes[e.a], nb = nodes[e.b];
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const dist = Math.hypot(dx, dy);

        // Static line
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `${NAVY}0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated packet
        const px = na.x + dx * e.progress;
        const py = na.y + dy * e.progress;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, `${MINT}0.9)`);
        grad.addColorStop(1, `${MINT}0)`);
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        if (!prefersReduced) {
          e.progress += e.speed;
          if (e.progress > 1) e.progress = 0;
        }
      }

      // Draw nodes
      for (const n of nodes) {
        // Outer ring pulse
        n.pulse += 0.012 * n.pulseDir;
        if (n.pulse > 1) n.pulseDir = -1;
        if (n.pulse < 0) n.pulseDir = 1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 8 + n.pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = `${MINT}${0.05 + n.pulse * 0.08})`;
        ctx.fill();

        // Node body
        const bg = ctx.createRadialGradient(n.x - 4, n.y - 4, 2, n.x, n.y, n.r);
        bg.addColorStop(0, "#f0f9ff");
        bg.addColorStop(1, "#e0f2fe");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.strokeStyle = `${MINT}0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = `${NAVY}0.85)`;
        ctx.font = `bold ${10}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, n.x, n.y);

        // Float drift
        if (!prefersReduced) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < n.r || n.x > W - n.r) n.vx *= -1;
          if (n.y < n.r || n.y > H - n.r) n.vy *= -1;
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    const ro = new ResizeObserver(() => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    });
    ro.observe(canvas);

    return () => { cancelAnimationFrame(frameRef.current); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}
