/**
 * Smooth scrolling with inertia, on both sites, for wheels, trackpads and touch screens, with no
 * extra package. Input sets a target; every frame the page moves a share of the way there, so it
 * glides and settles. On touch the page follows the finger closely and, on release, carries on
 * with the flick's speed before easing to a stop.
 * It moves the real window scroll position, so sticky stages and scroll scenes work unchanged.
 * Off when the visitor asks for reduced motion.
 */

const WHEEL_LERP = 0.085; // share of the remaining distance covered per 60 fps frame
const FINGER_LERP = 0.5; // while a finger is down: stay close to it
const FLING_LERP = 0.06; // after a flick: a long, soft glide
const FLING = 330; // how far a flick carries, in ms of its release speed

let lerp = WHEEL_LERP;

let active = false;
let users = 0;
let paused = false;
let target = 0;
let current = 0;
let raf = 0;
let selfScroll = false;
let glide: { from: number; to: number; start: number; dur: number } | null = null;
let last = 0;
let touch: { y: number; x: number; t: number; v: number; axis: '' | 'y' | 'x' } | null = null;

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
const clampY = (y: number) => Math.max(0, Math.min(maxScroll(), y));

const step = (now: number) => {
  raf = 0;
  if (glide) {
    const t = Math.min(1, (now - glide.start) / glide.dur);
    const e = 1 - Math.pow(1 - t, 4);
    current = glide.from + (glide.to - glide.from) * e;
    target = current;
    if (t >= 1) glide = null;
  } else {
    const dt = last ? Math.min(64, now - last) : 16.7;
    const k = 1 - Math.pow(1 - lerp, dt / 16.7); // same feel at 60 and 120 Hz
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.5) current = target;
  }
  last = now;
  selfScroll = true;
  window.scrollTo(0, current);
  if (glide || current !== target) raf = requestAnimationFrame(step);
  else last = 0;
};

const kick = () => {
  if (!raf) raf = requestAnimationFrame(step);
};

/** Scrollable boxes inside the page (menus, dialogs, long lists) scroll themselves */
const inScroller = (t: EventTarget | null) => {
  for (let n = t as HTMLElement | null; n && n !== document.body; n = n.parentElement) {
    if (!(n instanceof HTMLElement)) continue;
    if (n.closest('[role="dialog"], .peel, [data-native-scroll]')) return true; // menu, dialogs, the draggable corner
    const s = getComputedStyle(n);
    if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight) return true;
  }
  return false;
};

const onWheel = (e: WheelEvent) => {
  if (paused || e.ctrlKey || e.defaultPrevented || inScroller(e.target)) return; // pinch-zoom keeps native behaviour
  e.preventDefault();
  glide = null;
  lerp = WHEEL_LERP;
  const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
  if (!raf) current = window.scrollY;
  target = clampY(target + e.deltaY * unit * 0.9);
  kick();
};

const onTouchStart = (e: TouchEvent) => {
  if (paused || e.touches.length > 1 || inScroller(e.target)) {
    touch = null;
    return;
  }
  const t = e.touches[0];
  glide = null;
  if (!raf) current = target = window.scrollY;
  else target = current; // catching a glide stops it under the finger
  touch = { y: t.clientY, x: t.clientX, t: performance.now(), v: 0, axis: '' };
};

const onTouchMove = (e: TouchEvent) => {
  if (!touch || paused) return;
  if (e.touches.length > 1) {
    touch = null; // pinch-zoom
    return;
  }
  const t = e.touches[0];
  const dy = touch.y - t.clientY;
  const dx = touch.x - t.clientX;
  if (!touch.axis) {
    if (Math.abs(dy) < 4 && Math.abs(dx) < 4) return;
    touch.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  }
  if (touch.axis === 'x') return;
  if (e.cancelable) e.preventDefault();
  const now = performance.now();
  const dt = Math.max(1, now - touch.t);
  touch.v = touch.v * 0.6 + (dy / dt) * 0.4; // px per ms, smoothed
  touch.y = t.clientY;
  touch.x = t.clientX;
  touch.t = now;
  lerp = FINGER_LERP;
  target = clampY(target + dy);
  kick();
};

const onTouchEnd = () => {
  if (!touch) return;
  const { v, t, axis } = touch;
  touch = null;
  if (axis !== 'y') return;
  const held = performance.now() - t; // finger rested before lifting: no flick
  const speed = held > 90 ? 0 : v;
  lerp = FLING_LERP;
  target = clampY(target + speed * FLING * 2.2);
  kick();
};

// Scrollbar drags, keyboard, find-in-page: follow them instead of fighting them
const onScroll = () => {
  if (selfScroll) {
    selfScroll = false;
    return;
  }
  if (!raf) current = target = window.scrollY;
};

export const startSmoothScroll = () => {
  users++;
  if (active || typeof window === 'undefined') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  active = true;
  current = target = window.scrollY;
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
};

export const stopSmoothScroll = () => {
  users = Math.max(0, users - 1);
  if (users || !active) return;
  active = false;
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', onTouchEnd);
  window.removeEventListener('touchcancel', onTouchEnd);
  window.removeEventListener('scroll', onScroll);
  touch = null;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  glide = null;
};

/** Pause while a dialog (the menu) is open, so the page underneath stays put. */
export const pauseSmoothScroll = (p: boolean) => {
  paused = p;
  if (p && raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  if (!p) current = target = window.scrollY;
};

/** Glide to an element (or a y position). Falls back to the browser when smooth scrolling is off. */
export const smoothScrollTo = (dest: HTMLElement | number, opts: { immediate?: boolean } = {}) => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const y = typeof dest === 'number' ? dest : dest.getBoundingClientRect().top + window.scrollY;
  if (active && !opts.immediate && !reduce) {
    const from = window.scrollY;
    const to = clampY(y);
    glide = { from, to, start: performance.now(), dur: Math.min(1600, 600 + Math.abs(to - from) * 0.12) };
    kick();
    return;
  }
  window.scrollTo({ top: y, behavior: reduce || opts.immediate ? 'auto' : 'smooth' });
};
