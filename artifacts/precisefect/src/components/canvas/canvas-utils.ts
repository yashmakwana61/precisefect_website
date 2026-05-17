/** Clip all drawing to the canvas interior (prevents overflow artifacts). */
export function clipToCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.clip();
}

export function setupCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  const dpr = devicePixelRatio;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return { w, h };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Node labels — matches site sans */
export const CANVAS_LABEL_FONT = "Inter, system-ui, sans-serif";
/** Node subtitles — technical mono contrast */
export const CANVAS_SUBTITLE_FONT = '"IBM Plex Mono", ui-monospace, monospace';

export function loadCanvasTypography() {
  if (typeof document === "undefined" || !document.fonts?.load) {
    return Promise.resolve();
  }
  return Promise.all([
    document.fonts.load(`bold 14px ${CANVAS_LABEL_FONT}`),
    document.fonts.load(`500 10px ${CANVAS_SUBTITLE_FONT}`),
  ]).catch(() => undefined);
}

/** Shrink font until text fits maxWidth, then ellipsis-truncate if needed. */
export function fitCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: string,
  family: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
): { size: number; text: string } {
  let size = maxSize;
  const floor = Math.max(4, minSize);

  for (; size >= floor; size -= 0.5) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) {
      return { size, text };
    }
  }

  ctx.font = `${weight} ${floor}px ${family}`;
  let trimmed = text;
  while (trimmed.length > 1 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return { size: floor, text: trimmed.length < text.length ? `${trimmed}…` : trimmed };
}
