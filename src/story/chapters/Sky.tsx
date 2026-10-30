import { useRef } from 'react';
import Sticker from '../Sticker';
import { art, FORT_DOOR } from '../art';
import { ease, easeOut, lerp, motionMode, range, useScrollScene } from '../scroll-engine';
import { useGoToChapter } from '../navigation';

/**
 * From the sky to the fort.
 * It starts inside a big halftone cloud. Scrolling descends through the clouds, the altimeter counts
 * down to Pune (560 m), and a photocopied sticker of Shaniwar Wada lands on the page. Its name label
 * and an AWS-orange star are slapped on, the spiked doors swing open, and the camera walks through
 * the Dilli Darwaza into the dark. One rAF writes transforms and opacity; no layout work per frame.
 */

const PUNE_ALT = 560; // metres above sea level
const START_ALT = 3000;
const DOOR_CX = FORT_DOOR.x + FORT_DOOR.w / 2;
const DOOR_CY = FORT_DOOR.y + FORT_DOOR.h / 2;

const BRAND = ['A', 'W', 'S', ' ', 'P', 'U', 'N', 'E'];
const BRAND_TILT = [-6, 4, -3, 0, 5, -4, 3, -6];
const BRAND_TONE = ['ink', 'white', 'orange', '', 'orange', 'white', 'ink', 'orange'];

const Star = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
    <path
      d="M60 4 L71 40 L108 30 L84 60 L108 90 L71 80 L60 116 L49 80 L12 90 L36 60 L12 30 L49 40 Z"
      fill="#fff"
      stroke="#fff"
      strokeWidth="14"
      strokeLinejoin="round"
    />
    <path d="M60 4 L71 40 L108 30 L84 60 L108 90 L71 80 L60 116 L49 80 L12 90 L36 60 L12 30 L49 40 Z" fill="#ff9900" />
    <path d="M60 30 L66 50 L86 46 L73 60 L86 74 L66 70 L60 90 L54 70 L34 74 L47 60 L34 46 L54 50 Z" fill="#ffc266" />
  </svg>
);

const Sky = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bigRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const passRefs = useRef<Array<HTMLDivElement | null>>([]);
  const fortRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const brandRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const altRef = useRef<HTMLSpanElement>(null);
  const altWrap = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLButtonElement>(null);
  const full = motionMode() === 'full';
  const goTo = useGoToChapter();
  const lastAlt = useRef(-1);
  // The fort's box inside the stage, measured once per screen size (transforms don't change it)
  const fortBox = useRef({ key: '', w: 0, h: 0, top: 0, left: 0 });

  useScrollScene(
    sectionRef,
    (p, vh, vw) => {
      const fortEl = fortRef.current;
      if (fortEl && fortBox.current.key !== `${vw}x${vh}`) {
        fortBox.current = { key: `${vw}x${vh}`, w: fortEl.offsetWidth, h: fortEl.offsetHeight, top: fortEl.offsetTop, left: fortEl.offsetLeft };
      }
      // 1 — through the big cloud
      const through = range(p, 0.0, 0.34);
      if (bigRef.current) {
        const s = 1 + 2.6 * ease(through);
        bigRef.current.style.transform = `translate3d(-50%, ${(-vh * 0.55 * ease(through)).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        bigRef.current.style.opacity = (1 - range(p, 0.2, 0.33)).toFixed(3);
      }
      if (titleRef.current) {
        const o = range(p, 0.015, 0.11);
        titleRef.current.style.opacity = (1 - o).toFixed(3);
        titleRef.current.style.transform = `translate3d(0, ${(-vh * 0.12 * o).toFixed(1)}px, 0) scale(${(1 + o * 0.3).toFixed(3)})`;
      }
      // 2 — clouds rush up past you as you descend
      passRefs.current.forEach((el, i) => {
        if (!el) return;
        const speed = [1.25, 0.9, 1.6, 1.1][i];
        const t = range(p, 0.04 + i * 0.05, 0.42 + i * 0.05);
        el.style.transform = `translate3d(0, ${(vh * (1.1 - 2.4 * t * speed)).toFixed(1)}px, 0)`;
      });
      if (horizonRef.current) horizonRef.current.style.opacity = range(p, 0.12, 0.46).toFixed(3);

      // 3 — the fort lands
      const land = easeOut(range(p, 0.2, 0.52));
      const zoom = range(p, 0.76, 1);
      const fort = fortRef.current;
      if (fort) {
        const { w: fw, h: fh, top: ftop, left: fleft } = fortBox.current;
        const restY = 0;
        const fromY = vh * 0.85;
        let y = lerp(fromY, restY, land);
        const rx = lerp(32, 0, land);
        const bump = 1 + 0.025 * Math.sin(range(p, 0.5, 0.57) * Math.PI);
        // walking in: grow around the doorway and bring it to the centre of the screen
        const z = Math.pow(16, Math.pow(zoom, 1.5));
        const doorScreenY = ftop + DOOR_CY * fh; // relative to the stage
        const toCentre = ease(zoom);
        y += (vh * 0.5 - doorScreenY) * toCentre;
        const x = (vw * 0.5 - (fleft + DOOR_CX * fw)) * toCentre;
        fort.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) scale(${(lerp(0.86, 1, land) * bump * z).toFixed(4)})`;
        fort.style.setProperty('--lift', (1 - land).toFixed(3));
      }
      // 4 — doors open towards you
      const open = ease(range(p, 0.64, 0.8));
      if (leftRef.current) leftRef.current.style.transform = `rotateY(${(-78 * open).toFixed(2)}deg)`;
      if (rightRef.current) rightRef.current.style.transform = `rotateY(${(78 * open).toFixed(2)}deg)`;

      // 5 — the name label and the star are slapped on
      const slap = (el: HTMLDivElement | null, a: number, b: number, rot: number, from = 1.8) => {
        if (!el) return;
        const t = range(p, a, b);
        const gone = range(p, 0.72, 0.78);
        el.style.opacity = (Math.min(1, t * 3) * (1 - gone)).toFixed(3);
        el.style.transform = `rotate(${(rot + (1 - easeOut(t)) * 14).toFixed(2)}deg) scale(${lerp(from, 1, easeOut(t)).toFixed(3)})`;
      };
      // the letters of AWS PUNE are stuck on above the fort, one by one
      brandRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = range(p, 0.47 + i * 0.011, 0.51 + i * 0.011);
        const gone = range(p, 0.7, 0.76);
        const rot = BRAND_TILT[i % BRAND_TILT.length];
        el.style.opacity = (Math.min(1, t * 3) * (1 - gone)).toFixed(3);
        el.style.transform = `translate3d(0, ${(-40 * (1 - easeOut(t)) - vh * 0.08 * gone).toFixed(1)}px, 0) rotate(${(rot + (1 - easeOut(t)) * 18).toFixed(2)}deg) scale(${lerp(2.2, 1, easeOut(t)).toFixed(3)})`;
      });
      slap(labelRef.current, 0.52, 0.58, -4);
      slap(starRef.current, 0.56, 0.63, 12, 2.4);
      if (captionRef.current) {
        const t = range(p, 0.56, 0.62);
        const gone = range(p, 0.7, 0.76);
        captionRef.current.style.opacity = (t * (1 - gone)).toFixed(3);
        captionRef.current.style.transform = `translate3d(0, ${(24 * (1 - t)).toFixed(1)}px, 0)`;
      }
      // altimeter
      const alt = Math.round(lerp(START_ALT, PUNE_ALT, range(p, 0, 0.52)) / 10) * 10;
      if (altRef.current && alt !== lastAlt.current) {
        lastAlt.current = alt;
        altRef.current.textContent = alt.toLocaleString('en-IN');
      }
      if (altWrap.current) altWrap.current.style.opacity = (1 - range(p, 0.64, 0.7)).toFixed(3);
      if (darkRef.current) darkRef.current.style.opacity = range(p, 0.9, 0.99).toFixed(3);
      if (cueRef.current) cueRef.current.style.opacity = (1 - range(p, 0, 0.04)).toFixed(3);
    },
    { enabled: full },
  );

  const door = {
    left: `${FORT_DOOR.x * 100}%`,
    top: `${FORT_DOOR.y * 100}%`,
    width: `${FORT_DOOR.w * 100}%`,
    height: `${FORT_DOOR.h * 100}%`,
  };

  return (
    <section ref={sectionRef} className={`sky${full ? '' : ' sky--still'}`} aria-labelledby="hero-title">
      <div className="sky__stage">
        <div ref={horizonRef} className="sky__horizon" aria-hidden="true" />

        {/* the fort, landing */}
        <div ref={fortRef} className="landing" style={{ transformOrigin: `${DOOR_CX * 100}% ${DOOR_CY * 100}%` }}>
          <div className="landing__void" style={door} aria-hidden="true" />
          <Sticker
            art={art.fort}
            eager
            cell={3.6}
            className="landing__fort"
            alt="A photocopied cut-out sticker of the Dilli Darwaza, the main gate of Shaniwar Wada in Pune"
          />
          <div className="landing__doors" style={door} aria-hidden="true">
            <div ref={leftRef} className="landing__leaf landing__leaf--l" style={{ width: `${FORT_DOOR.seam * 100}%` }}>
              <Sticker art={art.doorL} eager cell={3.6} />
            </div>
            <div ref={rightRef} className="landing__leaf landing__leaf--r" style={{ width: `${(1 - FORT_DOOR.seam) * 100}%` }}>
              <Sticker art={art.doorR} eager cell={3.6} />
            </div>
          </div>
          <div ref={starRef} className="landing__star" style={{ left: `${(DOOR_CX + 0.07) * 100}%` }}>
            <Star />
          </div>
        </div>

        {/* AWS PUNE, cut-out letters stuck on above the fort */}
        <p className="landing__brand" aria-label="AWS Pune">
          {(() => {
            let n = 0;
            return BRAND.map((ch, i) => {
              if (ch === ' ') return <span key={i} className="landing__gap" aria-hidden="true" />;
              const k = n++;
              return (
                <span
                  key={i}
                  ref={(el) => (brandRefs.current[k] = el)}
                  className={`landing__letter landing__letter--${BRAND_TONE[i]}`}
                  style={{ ['--r' as string]: `${BRAND_TILT[i]}deg` }}
                  aria-hidden="true"
                >
                  {ch}
                </span>
              );
            });
          })()}
        </p>

        <div ref={labelRef} className="landing__label">
          <span className="dymo dymo--ink">Shaniwar Wada · Pune</span>
        </div>
        <div ref={captionRef} className="landing__caption">
          <p>
            <strong>AWS User Group Pune</strong> is a free, volunteer-run community for anyone building on Amazon Web
            Services. Every month we meet to learn a new service, show what we&rsquo;ve built and help each other ship.
          </p>
        </div>

        {/* clouds rushing past */}
        {[art.cloudA, art.cloudB, art.cloudA, art.cloudB].map((c, i) => (
          <div key={i} ref={(el) => (passRefs.current[i] = el)} className={`sky__pass sky__pass--${i}`} aria-hidden="true">
            <Sticker art={c} cell={4.6} eager={i < 2} />
          </div>
        ))}

        {/* the big cloud you start inside */}
        <div ref={bigRef} className="sky__big" aria-hidden="true">
          <Sticker art={art.cloudBig} eager cell={5} />
        </div>

        <div ref={titleRef} className="sky__title">
          <h1 id="hero-title">
            <span className="dymo">AWS User Group</span>
            <span className="sky__pune">Pune</span>
          </h1>
          <p className="sky__lead">Pune&rsquo;s cloud community. Free, volunteer-run, every month since 2019.</p>
        </div>

        <div ref={altWrap} className="sky__alt" aria-hidden="true">
          <span className="dymo dymo--sm">
            ALT <span ref={altRef}>{full ? '3,000' : '560'}</span> M
          </span>
        </div>

        <button ref={cueRef} type="button" className="sky__cue" onClick={() => goTo('inside')}>
          Scroll to land in Pune ↓
        </button>
        <div ref={darkRef} className="sky__dark" aria-hidden="true" />
      </div>
    </section>
  );
};

export default Sky;
