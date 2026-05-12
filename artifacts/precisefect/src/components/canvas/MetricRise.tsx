import { useEffect, useRef } from "react";

interface Bar {
  label: string; value: number; target: number;
  color: string; current: number; unit: string;
}

const BARS: Bar[] = [
  { label: "Order Accuracy", value: 0, target: 99.8, color: "rgba(0,200,140,", current: 0, unit: "%" },
  { label: "Manual Hours Saved", value: 0, target: 2400, color: "rgba(0,23,54,", current: 0, unit: "h" },
  { label: "Invoice Cycle (days)", value: 0, target: 1, color: "rgba(0,80,180,", current: 8, unit: "d" },
  { label: "Error Reduction", value: 0, target: 92, color: "rgba(0,200,140,", current: 0, unit: "%" },
];

export default function MetricRise({ className = "" }: { className?: string }) {
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

    const bars: Bar[] = BARS.map(b => ({ ...b, value: prefersReduced ? b.target : 0 }));
    let t = 0;

    function ease(x: number) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const PAD = 24;
      const barH = (H - PAD * 2) / bars.length - 12;
      const maxW = W - PAD * 2 - 120;
      const progress = Math.min(1, t / 90);

      bars.forEach((b, i) => {
        const y = PAD + i * (barH + 12);
        const animVal = ease(progress) * b.target;
        const fillW = (animVal / (b.target * 1.05)) * maxW;

        // Track
        ctx.beginPath();
        ctx.roundRect(PAD + 120, y + barH * 0.25, maxW, barH * 0.5, 4);
        ctx.fillStyle = "rgba(0,23,54,0.06)";
        ctx.fill();

        // Fill bar with gradient
        if (fillW > 0) {
          const grad = ctx.createLinearGradient(PAD + 120, 0, PAD + 120 + fillW, 0);
          grad.addColorStop(0, `${b.color}0.4)`);
          grad.addColorStop(1, `${b.color}0.95)`);
          ctx.beginPath();
          ctx.roundRect(PAD + 120, y + barH * 0.25, fillW, barH * 0.5, 4);
          ctx.fillStyle = grad;
          ctx.fill();

          // Glow cap
          const glow = ctx.createRadialGradient(PAD + 120 + fillW, y + barH * 0.5, 0, PAD + 120 + fillW, y + barH * 0.5, 16);
          glow.addColorStop(0, `${b.color}0.5)`);
          glow.addColorStop(1, `${b.color}0)`);
          ctx.beginPath();
          ctx.arc(PAD + 120 + fillW, y + barH * 0.5, 16, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Label
        ctx.fillStyle = "rgba(0,23,54,0.7)";
        ctx.font = `600 10px Inter, sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(b.label.toUpperCase(), PAD + 112, y + barH * 0.5);

        // Value counter
        const displayVal = animVal;
        const valStr = b.unit === "d"
          ? `${(8 - displayVal * (7 / b.target)).toFixed(1)}${b.unit}`
          : displayVal >= 1000
            ? `${(displayVal / 1000).toFixed(1)}k${b.unit}`
            : `${displayVal.toFixed(displayVal < 10 ? 1 : 0)}${b.unit}`;

        ctx.fillStyle = `${b.color}1)`;
        ctx.font = `bold 13px Inter, sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText(valStr, PAD + 120 + maxW + 8, y + barH * 0.5);
      });

      if (!prefersReduced) t++;
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
