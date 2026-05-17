/**
 * Motion hierarchy (one layer per moment — do not stack):
 * 1. Route: opacity fade only (App.tsx)
 * 2. Hero: mount animate — heroCopy + heroVisual (PageHero)
 * 3. Section: one reveal per below-fold block — sectionReveal OR staggered items, not both
 * 4. UI state: AnimatePresence on contact / mobile nav only
 */
export const easeSmooth = [0.22, 1, 0.36, 1] as const;

export const viewport = { once: true, amount: 0.12 } as const;

/** Whole-page route change — no vertical shift (avoids fighting hero motion). */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.22, ease: easeSmooth },
};

/** Hero text — runs on mount only. */
export const heroCopy = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: easeSmooth },
};

/** Hero visual — slide from right on wide layouts. */
export const heroVisual = {
  initial: { opacity: 0, scale: 0.98, x: 16 },
  animate: { opacity: 1, scale: 1, x: 0 },
  transition: { delay: 0.12, duration: 0.55, ease: easeSmooth },
};

/** Hero visual — centered / no horizontal offset. */
export const heroVisualCentered = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: 0.12, duration: 0.55, ease: easeSmooth },
};

/** Entire below-fold section block (heading + body together). */
export function sectionReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { delay, duration: 0.45, ease: easeSmooth },
  };
}

/** Grid/list item — use only when the section heading is NOT separately animated. */
export function itemReveal(index = 0, step = 0.06) {
  return {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { delay: index * step, duration: 0.4, ease: easeSmooth },
  };
}

/** @deprecated Prefer sectionReveal or itemReveal — kept for gradual migration */
export function fadeUpInView(delay = 0, y = 12) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { delay, duration: 0.4, ease: easeSmooth },
  };
}

export function staggerDelay(index: number, step = 0.06) {
  return index * step;
}

/** Above-fold cards (e.g. pricing tiers) — mount only, not whileInView. */
export function mountReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.45, ease: easeSmooth },
  };
}
