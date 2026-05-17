import { useEffect, useRef } from "react";
import {
  CANVAS_LABEL_FONT,
  CANVAS_SUBTITLE_FONT,
  clipToCanvas,
  fitCanvasText,
  loadCanvasTypography,
  prefersReducedMotion,
  setupCanvas,
} from "./canvas-utils";
import { bindCanvasAnimationLifecycle } from "./canvas-animation";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label: string;
  sub?: string;
  pulse: number;
  pulseDir: number;
  fixed?: boolean;
  tier: "core" | "satellite";
}

interface Edge {
  a: number;
  b: number;
  progress: number;
  speed: number;
  secondary?: boolean;
}

const LABELS_FULL = ["ERP Core", "Inventory", "Finance", "CRM", "Warehouse", "Dispatch"];
const LABELS_HUB = ["ERP Core", "Inventory", "Finance", "CRM", "Analytics"];

/** Full topology — used for uneven home hero */
const RICH_NODES = [
  { label: "ERP Core", sub: "source of truth", tier: "core" as const },
  { label: "Inventory", sub: "stock sync", tier: "satellite" as const },
  { label: "Finance", sub: "ledger", tier: "satellite" as const },
  { label: "CRM", sub: "pipeline", tier: "satellite" as const },
  { label: "Warehouse", sub: "fulfillment", tier: "satellite" as const },
  { label: "Dispatch", sub: "routing", tier: "satellite" as const },
  { label: "API Layer", sub: "middleware", tier: "satellite" as const },
  { label: "Analytics", sub: "telemetry", tier: "satellite" as const },
];

const NAVY = "rgba(0,23,54,";
const MINT = "rgba(0,200,140,";
const BLUE = "rgba(0,80,180,";

type NodeGraphProps = {
  className?: string;
  /** hub = compact fixed hero; orbit = simple drift; rich = uneven drift + detail (home) */
  variant?: "hub" | "orbit" | "rich";
};

export default function NodeGraph({ className = "", variant = "orbit" }: NodeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const isHub = variant === "hub";
    const isRich = variant === "rich";
    const isOrbit = variant === "orbit";

    let { w: W, h: H } = setupCanvas(canvas, ctx);
    const minDim = Math.min(W, H);
    /** Padding so labels + pulse rings stay inside the canvas */
    const canvasPad = Math.max(40, minDim * 0.06);

    /** ERP Core fixed at center; satellites uneven scatter with drift */
    const buildRichNodes = (): Node[] => {
      const cx = W / 2;
      const cy = H / 2;
      const baseRx = W / 2 - canvasPad;
      const baseRy = H / 2 - canvasPad;
      const coreR = minDim * 0.09;
      const satR = minDim * 0.065;
      const satelliteCount = RICH_NODES.length - 1;

      return RICH_NODES.map((n, i) => {
        if (i === 0) {
          return {
            x: cx,
            y: cy,
            vx: 0,
            vy: 0,
            r: coreR + Math.random() * coreR * 0.12,
            label: n.label,
            sub: n.sub,
            pulse: Math.random(),
            pulseDir: 1,
            fixed: true,
            tier: n.tier,
          };
        }

        const angle =
          ((i - 1) / satelliteCount) * Math.PI * 2 -
          Math.PI / 2 +
          (Math.random() - 0.5) * 0.22;
        const scatter = 0.82 + Math.random() * 0.18;
        return {
          x: cx + Math.cos(angle) * baseRx * scatter,
          y: cy + Math.sin(angle) * baseRy * scatter,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: satR + Math.random() * satR * 0.2,
          label: n.label,
          sub: n.sub,
          pulse: Math.random(),
          pulseDir: 1,
          fixed: false,
          tier: n.tier,
        };
      });
    };

    const buildNodes = (): Node[] => {
      if (isRich) return buildRichNodes();

      if (isHub) {
        const center = { x: W / 2, y: H / 2 };
        const inset = canvasPad * 0.35;
        const satellites = [
          { x: W * 0.5, y: inset },
          { x: W - inset, y: H * 0.34 },
          { x: W - inset * 1.1, y: H - inset },
          { x: inset, y: H - inset },
          { x: inset, y: H * 0.34 },
        ];
        const hubCoreR = minDim * 0.095;
        const hubSatR = minDim * 0.068;
        return LABELS_HUB.map((label, i) => {
          const pos = i === 0 ? center : satellites[i - 1];
          return {
            x: pos.x,
            y: pos.y,
            vx: 0,
            vy: 0,
            r: i === 0 ? hubCoreR : hubSatR,
            label,
            pulse: Math.random(),
            pulseDir: 1,
            fixed: true,
            tier: i === 0 ? "core" : "satellite",
          };
        });
      }

      return LABELS_FULL.map((label, i) => {
        const angle = (i / LABELS_FULL.length) * Math.PI * 2;
        const rx = W / 2 - canvasPad;
        const ry = H / 2 - canvasPad;
        const orbitR = minDim * 0.065;
        return {
          x: W / 2 + Math.cos(angle) * rx * (0.82 + Math.random() * 0.18),
          y: H / 2 + Math.sin(angle) * ry * (0.82 + Math.random() * 0.18),
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: orbitR + Math.random() * orbitR * 0.2,
          label,
          pulse: Math.random(),
          pulseDir: 1,
          tier: i === 0 ? "core" : "satellite",
        };
      });
    };

    let nodes = buildNodes();

    const buildEdges = (): Edge[] => {
      const edges: Edge[] = [];

      if (isRich) {
        for (let i = 1; i < nodes.length; i++) {
          edges.push({
            a: 0,
            b: i,
            progress: Math.random(),
            speed: 0.0025 + Math.random() * 0.003,
          });
        }
        for (let i = 1; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.5) continue;
            const speed = 0.002 + Math.random() * 0.003;
            edges.push({ a: i, b: j, progress: Math.random(), speed, secondary: true });
          }
        }
        return edges;
      }

      if (isHub) {
        for (let i = 1; i < nodes.length; i++) {
          edges.push({ a: 0, b: i, progress: Math.random(), speed: 0.002 + Math.random() * 0.002 });
        }
        return edges;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() > 0.55) continue;
          edges.push({ a: i, b: j, progress: Math.random(), speed: 0.002 + Math.random() * 0.002 });
        }
      }
      return edges;
    };

    let edges = buildEdges();

    const ambient: { x: number; y: number; vx: number; vy: number; o: number }[] = isRich
      ? Array.from({ length: 22 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          o: 0.06 + Math.random() * 0.14,
        }))
      : [];

    function drawBackground() {
      if (!isRich || !ctx) return;

      // Canvas is transparent — parent uses bg-surface. Whisper of depth only.
      const cx = W / 2;
      const cy = H / 2;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.72);
      g.addColorStop(0, "rgba(0,200,140,0.04)");
      g.addColorStop(1, "rgba(0,200,140,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      if (!reduced) {
        for (const p of ambient) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          if (isInsideNode(p.x, p.y, 4)) continue;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `${MINT}${p.o})`;
          ctx.fill();
        }
      }
    }

    function isInsideNode(px: number, py: number, inset = 0): boolean {
      for (const n of nodes) {
        const hit = n.r + (isRich ? 10 : 6) - inset;
        if (Math.hypot(px - n.x, py - n.y) < hit) return true;
      }
      return false;
    }

    function edgeSegment(e: Edge) {
      const na = nodes[e.a];
      const nb = nodes[e.b];
      const dx = nb.x - na.x;
      const dy = nb.y - na.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return null;
      const ux = dx / dist;
      const uy = dy / dist;
      const padA = na.r + (isRich ? 12 : 5);
      const padB = nb.r + (isRich ? 12 : 5);
      return {
        x1: na.x + ux * padA,
        y1: na.y + uy * padA,
        x2: nb.x - ux * padB,
        y2: nb.y - uy * padB,
        ux,
        uy,
      };
    }

    function drawEdgeLine(e: Edge) {
      if (!ctx) return;
      const seg = edgeSegment(e);
      if (!seg) return;

      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.strokeStyle = e.secondary ? `${NAVY}0.06)` : isRich ? `${NAVY}0.1)` : `${NAVY}0.08)`;
      ctx.lineWidth = e.secondary ? 0.75 : 1;
      if (e.secondary) ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawEdgePacket(e: Edge) {
      if (!ctx) return;
      const seg = edgeSegment(e);
      if (!seg) return;

      const px = seg.x1 + (seg.x2 - seg.x1) * e.progress;
      const py = seg.y1 + (seg.y2 - seg.y1) * e.progress;

      if (isInsideNode(px, py)) {
        if (!reduced) {
          e.progress += e.speed;
          if (e.progress > 1) e.progress = 0;
        }
        return;
      }

      const packetR = e.secondary ? 2.5 : isRich ? 4 : 3.5;
      const glowR = isRich ? 7 : 5;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      grad.addColorStop(0, e.secondary ? `${BLUE}0.8)` : `${MINT}0.92)`);
      grad.addColorStop(1, `${MINT}0)`);

      if (isRich && !e.secondary) {
        const trailLen = 12 + e.speed * 300;
        const tx = px - seg.ux * trailLen;
        const ty = py - seg.uy * trailLen;
        if (!isInsideNode(tx, ty) && !isInsideNode(px, py)) {
          const trail = ctx.createLinearGradient(tx, ty, px, py);
          trail.addColorStop(0, `${MINT}0)`);
          trail.addColorStop(0.6, `${MINT}0.22)`);
          trail.addColorStop(1, `${MINT}0.5)`);
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(px, py, packetR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      if (!reduced) {
        e.progress += e.speed;
        if (e.progress > 1) e.progress = 0;
      }
    }

    function drawNode(n: Node) {
      if (!ctx) return;
      n.pulse += 0.012 * n.pulseDir;
      if (n.pulse > 1) n.pulseDir = -1;
      if (n.pulse < 0) n.pulseDir = 1;

      const pulseRing = isRich ? 8 + n.pulse * 6 : n.tier === "core" ? 6 : 4;
      const pulseAlpha = isRich ? 0.05 + n.pulse * 0.09 : 0.04 + n.pulse * 0.06;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + pulseRing + (isRich ? n.pulse * 4 : 0), 0, Math.PI * 2);
      ctx.fillStyle = `${MINT}${pulseAlpha})`;
      ctx.fill();

      if (n.tier === "core" && isRich) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 12 + n.pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `${MINT}0.18)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const bg = ctx.createRadialGradient(n.x - 4, n.y - 4, 2, n.x, n.y, n.r);
      bg.addColorStop(0, isRich ? "#ffffff" : "#f0f9ff");
      bg.addColorStop(0.55, "#f0f9ff");
      bg.addColorStop(1, "#e0f2fe");
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = `${MINT}${n.tier === "core" ? 0.55 : 0.45})`;
      ctx.lineWidth = n.tier === "core" ? 1.75 : 1.5;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (isRich) {
        const maxTextW = n.r * 1.72;
        const hasSub = Boolean(n.sub);
        const maxStackH = n.r * 1.38;
        const lineGap = n.r * 0.08;
        const titleMax = hasSub
          ? Math.min(n.r * (n.tier === "core" ? 0.34 : 0.32), (maxStackH - lineGap) * 0.6)
          : n.r * (n.tier === "core" ? 0.36 : 0.34);
        const titleMin = n.r * 0.14;

        const title = fitCanvasText(
          ctx,
          n.label,
          "bold",
          CANVAS_LABEL_FONT,
          maxTextW,
          titleMax,
          titleMin,
        );

        /** Subtitle stays clearly smaller than the fitted title (~55% cap, ~38% floor). */
        const subRatio = 0.55;
        const subFloorRatio = 0.38;
        const sub = hasSub
          ? fitCanvasText(
              ctx,
              n.sub!,
              "500",
              CANVAS_SUBTITLE_FONT,
              maxTextW,
              title.size * subRatio,
              Math.max(4, title.size * subFloorRatio),
            )
          : null;

        const stackH = title.size + (sub ? lineGap + sub.size : 0);
        const labelY = hasSub ? n.y - stackH / 2 + title.size / 2 : n.y;
        const subY = hasSub && sub ? n.y + stackH / 2 - sub.size / 2 : n.y;

        ctx.fillStyle = `${NAVY}0.88)`;
        ctx.font = `bold ${title.size}px ${CANVAS_LABEL_FONT}`;
        ctx.fillText(title.text, n.x, labelY);

        if (sub) {
          ctx.fillStyle = `${MINT}0.72)`;
          ctx.font = `500 ${sub.size}px ${CANVAS_SUBTITLE_FONT}`;
          const prevSpacing = ctx.letterSpacing;
          ctx.letterSpacing = `${Math.min(0.08, 0.35 / sub.size)}em`;
          ctx.fillText(sub.text, n.x, subY);
          ctx.letterSpacing = prevSpacing;
        }
      } else {
        const titleSize =
          n.tier === "core"
            ? Math.max(10, Math.round(minDim * 0.026))
            : Math.max(9, Math.round(minDim * 0.022));
        ctx.fillStyle = `${NAVY}0.88)`;
        ctx.font = `bold ${titleSize}px ${CANVAS_LABEL_FONT}`;
        ctx.fillText(n.label, n.x, n.y);
      }

      if (!reduced && !n.fixed && (isOrbit || isRich)) {
        n.x += n.vx;
        n.y += n.vy;
        const pad = n.r + (isRich ? 10 : 12);
        if (n.x < pad || n.x > W - pad) n.vx *= -1;
        if (n.y < pad || n.y > H - pad) n.vy *= -1;
      }
    }

    function tick() {
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      clipToCanvas(ctx, W, H);
      ctx.clearRect(0, 0, W, H);

      drawBackground();

      const sortedEdges = [...edges].sort((a, b) => Number(a.secondary) - Number(b.secondary));
      for (const e of sortedEdges) drawEdgeLine(e);
      for (const n of nodes) drawNode(n);
      for (const e of sortedEdges) drawEdgePacket(e);

      ctx.restore();
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

    void loadCanvasTypography();

    const ro = new ResizeObserver(() => {
      ({ w: W, h: H } = setupCanvas(canvas, ctx));
      nodes = buildNodes();
      edges = buildEdges();
    });
    ro.observe(canvas);

    return () => {
      unbindLifecycle();
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={`w-full h-full min-h-full block ${className}`} aria-hidden />;
}
