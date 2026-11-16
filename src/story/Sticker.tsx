import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { StickerArt } from './art';

/**
 * A photocopied halftone cut-out sticker.
 * Art marked `color` (the event photos) is printed as a colour halftone with a finer screen; the rest
 * (fort, doors, clouds) stays a one-ink photocopy.
 *
 * The file on disk is a smooth grayscale "tone" image with a white die-cut border (small, compresses
 * well). In the browser it is turned into a newspaper dot screen once, on a canvas, at the screen's
 * real pixel density, so the dots stay crisp on any phone. The soft shadow is its own layer, so a
 * sticker can "lift" off the page (shadow grows and drifts) using transforms and opacity only.
 */

type Props = {
  art: StickerArt;
  alt?: string;
  /** dot pitch in CSS px */
  cell?: number;
  ink?: string;
  paper?: string;
  className?: string;
  style?: CSSProperties;
  /** draw as soon as mounted instead of when close to the screen */
  eager?: boolean;
  children?: ReactNode;
};

const hex = (c: string) => {
  const m = c.replace('#', '');
  const n = parseInt(m.length === 3 ? m.replace(/(.)/g, '$1$1') : m, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Colour prints: how far the gaps between dots lift towards white, and how dark the dots are. */
const LIGHT = 0.4;
const DARK = 0.52;

/** One period of a 45° dot screen, as thresholds 0..1, sized so it tiles exactly. */
const screenTile = (pitch: number) => {
  const p = Math.max(4, Math.round(pitch * Math.SQRT2));
  const t = new Float32Array(p * p);
  const k = (2 * Math.PI) / (p / Math.SQRT2);
  for (let y = 0; y < p; y++) {
    for (let x = 0; x < p; x++) {
      const u = (x + y) * Math.SQRT1_2 * k;
      const v = (y - x) * Math.SQRT1_2 * k;
      t[y * p + x] = (Math.cos(u) + Math.cos(v)) / 4 + 0.5;
    }
  }
  return { t, p };
};

const draw = (img: HTMLImageElement, canvas: HTMLCanvasElement, cssW: number, cell: number, ink: string, paper: string, color: boolean) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const W = Math.min(2600, Math.max(1, Math.round(cssW * dpr)));
  const H = Math.max(1, Math.round((W * img.naturalHeight) / img.naturalWidth));
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, W, H);
  const data = ctx.getImageData(0, 0, W, H);
  const px = data.data;
  const { t, p } = screenTile(cell * dpr);
  const [ir, ig, ib] = hex(ink);
  const [pr, pg, pb] = hex(paper);
  const soft = 0.09; // anti-aliasing band around each dot edge
  for (let y = 0; y < H; y++) {
    const row = (y % p) * p;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (px[i + 3] === 0) continue;
      if (color) {
        // colour print: the photo keeps its colours; where a dot sits it is darker, between dots lighter
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        const tone = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
        const d = (t[row + (x % p)] - tone) / soft + 0.5;
        const a = d <= 0 ? 0 : d >= 1 ? 1 : d;
        px[i] = r + (255 - r) * LIGHT + (r * DARK - (r + (255 - r) * LIGHT)) * a;
        px[i + 1] = g + (255 - g) * LIGHT + (g * DARK - (g + (255 - g) * LIGHT)) * a;
        px[i + 2] = b + (255 - b) * LIGHT + (b * DARK - (b + (255 - b) * LIGHT)) * a;
        continue;
      }
      const tone = px[i] / 255;
      const d = (t[row + (x % p)] - tone) / soft + 0.5; // >1 = full ink
      const a = d <= 0 ? 0 : d >= 1 ? 1 : d;
      px[i] = pr + (ir - pr) * a;
      px[i + 1] = pg + (ig - pg) * a;
      px[i + 2] = pb + (ib - pb) * a;
    }
  }
  ctx.putImageData(data, 0, 0);
};

export type StickerHandle = { el: HTMLDivElement | null };

const Sticker = forwardRef<StickerHandle, Props>(
  ({ art, alt = '', cell: cellProp, ink = '#141210', paper = '#faf7f0', className, style, eager, children }, ref) => {
    const wrap = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);
    const color = !!art.color;
    // colour photos get a finer screen so faces stay recognisable
    const cell = cellProp ?? (color ? 2.4 : 4.2);
    useImperativeHandle(ref, () => ({ el: wrap.current }), []);

    useEffect(() => {
      const el = wrap.current;
      const cv = canvas.current;
      if (!el || !cv) return;
      let cancelled = false;
      let drawnW = 0;
      const img = new Image();
      img.decoding = 'async';
      const render = () => {
        const w = el.getBoundingClientRect().width || el.offsetWidth;
        if (!w || !img.complete || !img.naturalWidth) return;
        if (drawnW && Math.abs(w - drawnW) / drawnW < 0.25) return; // redraw only on real size changes
        drawnW = w;
        try {
          draw(img, cv, w, cell, ink, paper, color);
          if (!cancelled) setReady(true);
        } catch {
          /* canvas unavailable: the tone image stays visible */
        }
      };
      const start = () => {
        img.onload = () => {
          const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
          if (idle) idle(render);
          else setTimeout(render, 0);
        };
        img.src = art.src;
      };
      let io: IntersectionObserver | null = null;
      if (eager || !('IntersectionObserver' in window)) start();
      else {
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io?.disconnect();
              start();
            }
          },
          { rootMargin: '120% 0px' },
        );
        io.observe(el);
      }
      let t = 0;
      const onResize = () => {
        clearTimeout(t);
        t = window.setTimeout(render, 200);
      };
      window.addEventListener('resize', onResize);
      return () => {
        cancelled = true;
        io?.disconnect();
        window.removeEventListener('resize', onResize);
        clearTimeout(t);
      };
    }, [art.src, cell, ink, paper, eager, color]);

    return (
      <div
        ref={wrap}
        className={`stk${color ? ' stk--color' : ''}${ready ? ' is-ready' : ''}${className ? ` ${className}` : ''}`}
        style={{ aspectRatio: `${art.w} / ${art.h}`, ...style }}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        {art.shadow && <img className="stk__shadow" src={art.shadow} alt="" aria-hidden="true" decoding="async" />}
        <img className="stk__tone" src={art.src} alt="" aria-hidden="true" decoding="async" loading={eager ? 'eager' : 'lazy'} />
        <canvas ref={canvas} className="stk__dots" aria-hidden="true" />
        {children}
      </div>
    );
  },
);
Sticker.displayName = 'Sticker';

export default Sticker;
