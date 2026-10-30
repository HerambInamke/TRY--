import { useEffect, useRef } from 'react';

/**
 * One scroll listener and one requestAnimationFrame for every 3D scene on the page.
 * Scenes write transforms straight to the DOM (no React re-render while scrolling),
 * and only scenes near the screen do any work.
 */

type Scene = {
  el: HTMLElement;
  update: (progress: number, vh: number, vw: number, top: number, height: number) => void;
  /** Extra screens above/below the section in which the scene keeps updating */
  margin: number;
};

const scenes = new Set<Scene>();
let frame = 0;
let listening = false;

const run = () => {
  frame = 0;
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  // Read every position first, then let the scenes write. Interleaving the two would force the
  // browser to recalculate layout once per scene, every frame.
  const live: Array<[Scene, DOMRect]> = [];
  scenes.forEach((s) => {
    const r = s.el.getBoundingClientRect();
    if (r.bottom < -vh * s.margin || r.top > vh * (1 + s.margin)) return; // off screen: skip
    live.push([s, r]);
  });
  live.forEach(([s, r]) => {
    const travel = Math.max(1, r.height - vh);
    const p = Math.min(1, Math.max(0, -r.top / travel));
    s.update(p, vh, vw, r.top, r.height);
  });
};

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(run);
};

const listen = () => {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
};

const unlisten = () => {
  if (!listening || scenes.size) return;
  listening = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
};

export const refreshScenes = schedule;

/** Register a scene on a plain element (no React ref). Returns the unregister function. */
export const addScene = (el: HTMLElement, update: Scene['update'], margin = 0.5) => {
  const scene: Scene = { el, margin, update };
  scenes.add(scene);
  listen();
  schedule();
  return () => {
    scenes.delete(scene);
    unlisten();
  };
};

/**
 * Calls `update(progress)` as the section scrolls past, where progress runs 0 → 1 while the
 * section's sticky stage is pinned. `update` must only write styles; it runs inside rAF.
 */
export const useScrollScene = (
  ref: React.RefObject<HTMLElement>,
  update: (progress: number, vh: number, vw: number, top: number, height: number) => void,
  { enabled = true, margin = 0.5 }: { enabled?: boolean; margin?: number } = {},
) => {
  const latest = useRef(update);
  latest.current = update;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const scene: Scene = { el, margin, update: (p, vh, vw, top, h) => latest.current(p, vh, vw, top, h) };
    scenes.add(scene);
    listen();
    schedule();
    return () => {
      scenes.delete(scene);
      unlisten();
    };
  }, [ref, enabled, margin]);
};

/* ── Small maths helpers for choreography ─────────────────── */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** 0 → 1 as p moves from a to b */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // cubic in-out
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Motion preferences, read once per page view */
export const motionMode = (): 'full' | 'reduced' => {
  if (typeof window === 'undefined') return 'full';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced';
  if (typeof CSS !== 'undefined' && !CSS.supports('transform-style', 'preserve-3d')) return 'reduced';
  return 'full';
};
