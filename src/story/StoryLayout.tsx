import { useEffect, useRef, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import StoryHeader, { type HeaderBrand } from './StoryHeader';
import { addScene, motionMode } from './scroll-engine';
import { startSmoothScroll, stopSmoothScroll } from './smooth';
import './story.css';

/**
 * Shell for every page in the sticker-scrapbook design.
 * - Scopes the look under `.story`, so older pages keep theirs.
 * - Runs the one-time entrance reveals ([data-sr]).
 */
type Props = { children: ReactNode; footer?: ReactNode; brand?: HeaderBrand; theme?: 'main' | 'hte'; themeColor?: string };

const StoryLayout = ({ children, footer, brand, theme = 'main', themeColor = '#3f6fd8' }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const hasFooter = !!footer;

  // Smooth, inertial wheel scrolling for the whole page; every page starts at its top
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
    startSmoothScroll();
    return stopSmoothScroll;
  }, []);

  // Chapter changes: each chapter is a torn sheet that slides up over the one before it, which sinks
  // back and dims a little as it is covered. Transforms and opacity only, and only while covered.
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const full = motionMode() === 'full';
    const offs: Array<() => void> = [];
    const added: HTMLElement[] = [];
    const sections = Array.from(main.children).filter((n): n is HTMLElement => n instanceof HTMLElement && n.tagName === 'SECTION');
    sections.forEach((sec, i) => {
      sec.style.zIndex = String(i + 1);
      if (!sec.style.position && getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
      const prev = sections[i - 1];
      if (prev && !sec.hasAttribute('data-no-tear')) {
        const tear = document.createElement('div');
        tear.className = 'tear';
        tear.setAttribute('aria-hidden', 'true');
        tear.style.color = getComputedStyle(prev).backgroundColor;
        sec.prepend(tear);
        added.push(tear);
      }
      if (!full || sec.hasAttribute('data-no-stack') || (i === sections.length - 1 && !hasFooter)) return;
      const dim = document.createElement('div');
      dim.className = 'cover-dim';
      dim.setAttribute('aria-hidden', 'true');
      sec.append(dim);
      added.push(dim);
      let was = false;
      offs.push(
        addScene(
          sec,
          (_p, vh, _vw, top, height) => {
            const covered = Math.min(vh, Math.max(0, vh - (top + height)));
            const c = covered / vh;
            if (c <= 0) {
              if (was) {
                sec.style.transform = '';
                sec.style.willChange = '';
                dim.style.opacity = '0';
                was = false;
              }
              return;
            }
            was = true;
            sec.style.willChange = 'transform';
            sec.style.transform = `translate3d(0, ${(covered * 0.45).toFixed(1)}px, 0) scale(${(1 - 0.06 * c).toFixed(4)}) rotate(${(-1.2 * c).toFixed(3)}deg)`;
            dim.style.opacity = (0.55 * c).toFixed(3);
          },
          1.2,
        ),
      );
    });
    return () => {
      offs.forEach((off) => off());
      added.forEach((el) => el.remove());
      sections.forEach((sec) => {
        sec.style.transform = '';
        sec.style.willChange = '';
      });
    };
  }, [hasFooter]);

  // Browser chrome and overscroll take the dawn sky's colour while the page is open
  useEffect(() => {
    const html = document.documentElement;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prev = { bg: html.style.backgroundColor, pad: html.style.scrollPaddingTop, sb: html.style.scrollBehavior, theme: meta?.content };
    // the smooth scroller does the easing; native smooth scrolling on top of it would fight it
    html.style.scrollBehavior = 'auto';
    html.style.backgroundColor = '#141210';
    html.style.scrollPaddingTop = '0px';
    if (meta) meta.content = themeColor;
    return () => {
      html.style.backgroundColor = prev.bg;
      html.style.scrollPaddingTop = prev.pad;
      html.style.scrollBehavior = prev.sb;
      if (meta && prev.theme) meta.content = prev.theme;
    };
  }, [themeColor]);

  // Entrance reveals: added once, never replayed, never hiding content without script
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add('js');
    root.dataset.motion = motionMode();
    if (!('IntersectionObserver' in window)) {
      root.querySelectorAll('[data-sr], [data-slap]').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );
    const bind = () => {
      root.querySelectorAll<HTMLElement>('[data-sr]:not([data-sr-bound]), [data-slap]:not([data-sr-bound])').forEach((el) => {
        el.dataset.srBound = '';
        io.observe(el);
      });
    };
    bind();
    const mo = new MutationObserver(bind);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={`story${theme === 'hte' ? ' story--hte' : ''}`}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </Helmet>
      <a className="skip" href="#story-main">
        Skip to content
      </a>
      {/* page change: the previous page is a sheet that peels off towards the bottom-right corner */}
      <div className="pt" aria-hidden="true">
        <div className="pt__sheet" />
        <div className="pt__flap" />
      </div>
      <StoryHeader brand={brand} />
      <main id="story-main" ref={mainRef}>{children}</main>
      {footer}
    </div>
  );
};

export default StoryLayout;
