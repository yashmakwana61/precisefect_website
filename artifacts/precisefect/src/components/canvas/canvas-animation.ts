/** Pause canvas rAF when off-screen or tab is hidden. */
export function bindCanvasAnimationLifecycle(
  canvas: HTMLCanvasElement,
  callbacks: { onResume: () => void; onPause: () => void },
): () => void {
  let active = false;
  let visible = typeof document !== "undefined" ? !document.hidden : true;
  let intersecting = true;

  const sync = () => {
    const shouldRun = visible && intersecting;
    if (shouldRun && !active) {
      active = true;
      callbacks.onResume();
    } else if (!shouldRun && active) {
      active = false;
      callbacks.onPause();
    }
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      intersecting = entry?.isIntersecting ?? false;
      sync();
    },
    { rootMargin: "80px", threshold: 0 },
  );
  io.observe(canvas);

  const onVisibility = () => {
    visible = !document.hidden;
    sync();
  };
  document.addEventListener("visibilitychange", onVisibility);
  sync();

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    if (active) callbacks.onPause();
  };
}
