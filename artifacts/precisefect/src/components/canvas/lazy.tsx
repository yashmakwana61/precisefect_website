import { lazy, Suspense, type ComponentType } from "react";

const fallback = (
  <div className="absolute inset-0 bg-surface animate-pulse" aria-hidden />
);

function withCanvasLazy<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
) {
  const Lazy = lazy(factory);
  return function LazyCanvas(props: P) {
    return (
      <Suspense fallback={fallback}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}

export const LazyNodeGraph = withCanvasLazy(() => import("./NodeGraph"));
export const LazyDataStream = withCanvasLazy(() => import("./DataStream"));
export const LazyCoreStack = withCanvasLazy(() => import("./CoreStack"));
export const LazySectorMesh = withCanvasLazy(() => import("./SectorMesh"));
export const LazyMetricRise = withCanvasLazy(() => import("./MetricRise"));
