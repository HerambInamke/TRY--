import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import mark from '@/assets/story/mark.png';
import { links } from './content';
import { chapters as mainChapters, useGoToChapter, type Chapter } from './navigation';
import { pauseSmoothScroll, smoothScrollTo } from './smooth';

/**
 * The navigation is made of stickers.
 * - Top left: the badge, stuck on at an angle.
 * - Top right: a star that says JOIN and slowly turns.
 * - Bottom right: the corner of the page is peeling. Tap it, or grab it and pull, and the whole page
 *   peels back like paper to show the menu underneath: a sheet of label-maker stickers.
 */
const TILTS = [-4, 3, -2, 5, -3, 2, -5, 4];

export type HeaderBrand = {
  /** where the badge goes */
  home: string;
  badge: ReactNode;
  badgeLabel: string;
  menuHead: string;
  chapters: Chapter[];
  star: { label: string; aria: string; href?: string; onClick?: () => void };
  /** extra links at the bottom of the menu sheet */
  foot: { label: string; href: string; newTab?: boolean }[];
};

export const mainBrand: HeaderBrand = {
  home: '/',
  badge: (
    <>
      <img src={mark} alt="" width={26} height={30} />
      <span>AWSUG Pune</span>
    </>
  ),
  badgeLabel: 'AWS User Group Pune, home',
  menuHead: 'Peel a sticker. Go anywhere.',
  chapters: mainChapters,
  star: { label: 'Join', aria: 'Join AWS User Group Pune on Meetup', href: links.meetup },
  foot: [
    { label: 'Meetup', href: links.meetup, newTab: true },
    { label: 'LinkedIn', href: links.linkedin, newTab: true },
    { label: 'X', href: links.x, newTab: true },
  ],
};

const OPEN_AT = 150; // px of pull after which letting go opens the menu
const isReduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const StoryHeader = ({ brand = mainBrand }: { brand?: HeaderBrand }) => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const goTo = useGoToChapter();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ id: number; moved: number; x0: number; y0: number } | null>(null);
  const busyTimer = useRef(0);

  // how far the fold must travel to uncover the whole screen
  useEffect(() => {
    const size = () => {
      const r = rootRef.current;
      if (r) r.style.setProperty('--peel-max', String(Math.ceil((window.innerWidth + window.innerHeight) * 1.08)));
    };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  const setBusy = () => {
    const r = rootRef.current;
    if (!r) return;
    r.classList.add('is-busy');
    clearTimeout(busyTimer.current);
    busyTimer.current = window.setTimeout(() => r.classList.remove('is-busy'), 950);
  };

  const toggle = useCallback((next: boolean) => {
    setBusy();
    setOpen(next);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseSmoothScroll(true);
    const trigger = btnRef.current;
    const first = sheetRef.current?.querySelector<HTMLElement>('.sheet__list a, .sheet__list button');
    const t = window.setTimeout(() => first?.focus({ preventScroll: true }), isReduced() ? 0 : 520);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggle(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      pauseSmoothScroll(false);
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
      trigger?.focus({ preventScroll: true });
    };
  }, [open, toggle]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => () => clearTimeout(busyTimer.current), []);

  // The closed corner lifts briefly every few seconds so people notice it can be peeled
  useEffect(() => {
    if (open || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let down = 0;
    const lift = window.setInterval(() => {
      const r = rootRef.current;
      if (!r || document.hidden) return;
      r.classList.add('is-nudge');
      down = window.setTimeout(() => r.classList.remove('is-nudge'), 650);
    }, 5200);
    return () => {
      clearInterval(lift);
      clearTimeout(down);
      rootRef.current?.classList.remove('is-nudge');
    };
  }, [open]);

  // grab the corner and pull: the fold follows your finger
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, moved: 0, x0: e.clientX, y0: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const r = rootRef.current;
    if (!d || d.id !== e.pointerId || !r) return;
    d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.x0, e.clientY - d.y0));
    if (d.moved < 6) return;
    // the corner follows the finger, so the fold sits halfway between the corner and the finger
    const fold = (window.innerWidth - e.clientX + (window.innerHeight - e.clientY)) / 2;
    r.classList.add('is-drag');
    r.style.setProperty('--peel', String(Math.max(40, fold * 1.15)));
  };
  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const r = rootRef.current;
    drag.current = null;
    if (!d || !r) return;
    const wasDrag = d.moved >= 6;
    const fold = parseFloat(r.style.getPropertyValue('--peel')) || 0;
    r.classList.remove('is-drag');
    r.style.removeProperty('--peel');
    if (e.type === 'pointercancel') return toggle(false);
    if (!wasDrag) return toggle(true); // a tap
    toggle(fold > OPEN_AT);
  };

  const go = (c: Chapter) => (e: React.MouseEvent) => {
    if (c.newTab) {
      toggle(false);
      return; // let the browser open the new tab
    }
    e.preventDefault();
    toggle(false);
    if (c.href) {
      navigate(c.href);
      return;
    }
    window.setTimeout(() => goTo(c.id, brand.home), isReduced() ? 0 : 320);
  };

  const handleLogout = async () => {
    toggle(false);
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const tab = open ? 0 : -1;

  return (
    <>
      <Link
        to={brand.home}
        className="nav-badge"
        aria-label={brand.badgeLabel}
        onClick={(e) => {
          if (pathname === brand.home) {
            e.preventDefault();
            smoothScrollTo(0);
          }
        }}
      >
        {brand.badge}
      </Link>

      {brand.star.href ? (
        <a className="nav-star" href={brand.star.href} target="_blank" rel="noopener noreferrer" aria-label={brand.star.aria}>
          <StarShape />
          <span>{brand.star.label}</span>
        </a>
      ) : (
        <button type="button" className="nav-star" onClick={brand.star.onClick} aria-label={brand.star.aria}>
          <StarShape />
          <span>{brand.star.label}</span>
        </button>
      )}

      <div ref={rootRef} className={`peel${open ? ' is-open' : ''}`}>
        <div
          id="story-menu"
          ref={sheetRef}
          className="sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          aria-hidden={!open}
          {...(!open ? { inert: '' } : {})}
        >
          <button type="button" className="dymo sheet__close" onClick={() => toggle(false)} tabIndex={tab}>
            Close ✕
          </button>
          <p className="sheet__head">{brand.menuHead}</p>
          <nav aria-label="Sections">
            <ul className="sheet__list">
              {brand.chapters.map((c, i) => (
                <li key={c.id} style={{ ['--tilt' as string]: `${TILTS[i % TILTS.length]}deg`, ['--i' as string]: i }}>
                  <a
                    className={`dymo ${i % 3 === 1 ? 'dymo--orange' : i % 3 === 2 ? 'dymo--blue' : ''}`}
                    href={c.href ?? `${brand.home === '/' ? '/' : brand.home}#${c.id}`}
                    onClick={go(c)}
                    {...(c.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    tabIndex={tab}
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sheet__foot">
            {brand.foot.map((f) =>
              f.newTab ? (
                <a key={f.label} href={f.href} target="_blank" rel="noopener noreferrer" tabIndex={tab}>
                  {f.label}
                </a>
              ) : (
                <Link key={f.label} to={f.href} tabIndex={tab}>
                  {f.label}
                </Link>
              ),
            )}
            {user ? (
              <>
                <Link to="/dashboard" tabIndex={tab}>
                  {isAdmin ? 'Admin dashboard' : 'My dashboard'}
                </Link>
                <button type="button" onClick={handleLogout} tabIndex={tab}>
                  Log out
                </button>
              </>
            ) : (
              <Link to="/dashboard/login" tabIndex={tab}>
                Member login
              </Link>
            )}
          </div>
        </div>

        <div className="peel__flap" aria-hidden="true" />

        <button
          ref={btnRef}
          type="button"
          className="peel__btn"
          aria-expanded={open}
          aria-controls="story-menu"
          aria-label="Open the menu"
          onPointerEnter={(e) => e.pointerType === 'mouse' && rootRef.current?.classList.add('is-hover')}
          onPointerLeave={() => rootRef.current?.classList.remove('is-hover')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle(true);
            }
          }}
        >
          <span className="peel__label" aria-hidden="true">
            Menu
          </span>
        </button>
      </div>
    </>
  );
};

const StarShape = () => (
  <svg viewBox="0 0 120 120" aria-hidden="true">
    <path
      d="M60 3 L71 39 L109 29 L85 60 L109 91 L71 81 L60 117 L49 81 L11 91 L35 60 L11 29 L49 39 Z"
      fill="#fff"
      stroke="#fff"
      strokeWidth="12"
      strokeLinejoin="round"
    />
    <path d="M60 3 L71 39 L109 29 L85 60 L109 91 L71 81 L60 117 L49 81 L11 91 L35 60 L11 29 L49 39 Z" fill="var(--orange)" />
  </svg>
);

export default StoryHeader;
