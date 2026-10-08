import { useEffect, useRef } from 'react';

interface MistPuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  initialRadius: number;
  maxRadius: number;
  born: number;
  life: number;
  r: number;
  g: number;
  b: number;
  baseAlpha: number;
  wobbleSeed: number;
  wobbleSpeed: number;
}

export default function GlobalCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. Accessibility & Touch Detection: Exit early on touch/coarse devices and reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouchDevice = window.matchMedia('(pointer: coarse)');

    if (prefersReducedMotion.matches || isTouchDevice.matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Support Retina displays while capping at 2x for smooth 60fps rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', onResize, { passive: true });

    // Pool of active cloud/mist puffs — small and capped for performance
    const puffs: MistPuff[] = [];
    const MAX_PUFFS = 28;

    let lastX = -1;
    let lastY = -1;
    let lastTime = performance.now();
    let animFrameId: number | null = null;
    let isHoveringInteractive = false;

    // Palette: Soft violet, gentle lavender, and faint cloud white matching the site's atmosphere
    const MIST_COLORS = [
      { r: 192, g: 132, b: 252 }, // #C084FC (soft atmospheric violet)
      { r: 168, g: 85, b: 247 },  // #A855F7 (deep violet)
      { r: 216, g: 180, b: 254 }, // #D8B4FE (ethereal lavender)
      { r: 233, g: 213, b: 255 }, // #E9D5FF (soft vapor white)
    ];

    const addPuff = (x: number, y: number, speed: number) => {
      if (puffs.length >= MAX_PUFFS) {
        puffs.shift();
      }

      const color = MIST_COLORS[Math.floor(Math.random() * MIST_COLORS.length)];

      // Subtle organic inertia drift
      const angle = Math.random() * Math.PI * 2;
      const driftSpeed = 0.12 + Math.random() * 0.28;
      const vx = Math.cos(angle) * driftSpeed;
      const vy = Math.sin(angle) * driftSpeed - 0.08; // Gentle buoyant upward lift

      // Puffs start small and diffuse outward
      const initialRadius = isHoveringInteractive
        ? 14 + Math.random() * 6
        : 10 + Math.random() * 5;

      const maxRadius = initialRadius + 18 + Math.random() * 16; // Expands to ~28px–45px

      // Lifespan: 500ms to 900ms as requested
      const life = 520 + Math.random() * 360;

      // Soft, low peak opacity: 0.09 to 0.18 (very subtle, non-intrusive)
      const baseAlpha = isHoveringInteractive
        ? 0.16 + Math.random() * 0.06
        : 0.10 + Math.random() * 0.06;

      puffs.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx,
        vy,
        initialRadius,
        maxRadius,
        born: performance.now(),
        life,
        r: color.r,
        g: color.g,
        b: color.b,
        baseAlpha,
        wobbleSeed: Math.random() * Math.PI * 2,
        wobbleSpeed: 2 + Math.random() * 3,
      });

      // Start animation loop if not active
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const x = e.clientX;
      const y = e.clientY;

      if (lastX === -1 || lastY === -1) {
        lastX = x;
        lastY = y;
        lastTime = now;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const speed = dist / dt; // px/ms

      // Check if hovering an interactive element (button, link, input)
      const target = e.target as HTMLElement | null;
      isHoveringInteractive = Boolean(
        target && target.closest && target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')
      );

      // Distance threshold: slower movement = sparser mist; faster = slightly more vapor
      const threshold = isHoveringInteractive ? 14 : speed > 0.9 ? 10 : 20;

      if (dist >= threshold) {
        const steps = Math.min(Math.floor(dist / threshold), 2);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const interpX = lastX + dx * t;
          const interpY = lastY + dy * t;
          addPuff(interpX, interpY, speed);
        }

        lastX = x;
        lastY = y;
        lastTime = now;
      }
    };

    const onPointerLeave = () => {
      lastX = -1;
      lastY = -1;
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        const age = now - p.born;

        if (age >= p.life) {
          continue;
        }

        const progress = age / p.life; // 0 to 1

        // Organic fluid drift with subtle sinusoidal wobble
        p.x += p.vx + Math.sin(p.wobbleSeed + progress * p.wobbleSpeed) * 0.15;
        p.y += p.vy;

        // Friction dampening
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Radial expansion: begins focused and expands gently as it disperses
        const currentRadius = p.initialRadius + (p.maxRadius - p.initialRadius) * Math.sin((progress * Math.PI) / 2);

        // Exponential decay: smooth dissolution leaving only a whisper of faint ambient glow
        const currentAlpha = p.baseAlpha * Math.pow(1 - progress, 1.5);

        // Feathered soft radial gradient (mist puff)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
        gradient.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${currentAlpha.toFixed(3)})`);
        gradient.addColorStop(0.45, `rgba(${p.r}, ${p.g}, ${p.b}, ${(currentAlpha * 0.5).toFixed(3)})`);
        gradient.addColorStop(1, `rgba(${p.r}, ${p.g}, ${p.b}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Prune expired puffs from the front
      while (puffs.length > 0 && now - puffs[0].born >= puffs[0].life) {
        puffs.shift();
      }

      // Continue animating while puffs exist; otherwise sleep to conserve 100% CPU when idle
      if (puffs.length > 0) {
        animFrameId = requestAnimationFrame(render);
      } else {
        animFrameId = null;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 select-none"
      style={{
        width: '100vw',
        height: '100vh',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
}
