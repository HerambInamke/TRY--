import { useMemo, useRef } from 'react';
import Sticker from '../Sticker';
import { art } from '../art';
import { FIRST_MEETUP } from '../content';
import { easeOut, lerp, motionMode, range, useScrollScene } from '../scroll-engine';

const monthsSince = () => {
  const now = new Date();
  return (now.getFullYear() - FIRST_MEETUP.year) * 12 + (now.getMonth() - FIRST_MEETUP.month) + 1;
};

/** overshoot then settle, for things that get slapped on */
const easeOutBack = (t: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

const TAPE_TILT = [-4, 3, -2.5, 4];
const TAPE_FROM = [-1, 1, -1, 1]; // which side each tape flies in from

/**
 * The counter wall. While this chapter is pinned, the crowd photo swings round to face you, giant
 * outlined words slide past behind it, and four label tapes fly in one after another and slap onto
 * the photo, each number counting up as it lands.
 */
const Numbers = () => {
  const months = useMemo(monthsSince, []);
  const rows = [
    { n: 20000, suffix: '+', small: 'members', tone: 'ink' },
    { n: months, suffix: '', small: 'months in a row', tone: 'orange' },
    { n: 700, suffix: '+', small: 'at Community Day 2026', tone: 'blue' },
    { n: 50, suffix: '+', small: 'speakers on our stage', tone: 'white' },
  ];
  const full = motionMode() === 'full';
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);
  const tapeRefs = useRef<Array<HTMLLIElement | null>>([]);
  const numRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const starRefs = useRef<Array<HTMLDivElement | null>>([]);
  const shown = useRef<number[]>([]);

  useScrollScene(
    sectionRef,
    (p, vh, vw) => {
      if (headRef.current) {
        const t = easeOutBack(range(p, 0, 0.08));
        headRef.current.style.transform = `translate3d(0, ${(-30 * (1 - t)).toFixed(1)}px, 0) rotate(${(-2 + 6 * (1 - t)).toFixed(2)}deg) scale(${lerp(1.4, 1, t).toFixed(3)})`;
        headRef.current.style.opacity = Math.min(1, range(p, 0, 0.05) * 1.5).toFixed(3);
      }
      // words behind, sliding opposite ways
      if (rowA.current) rowA.current.style.transform = `translate3d(${(-p * vw * 1.4).toFixed(1)}px, 0, 0)`;
      if (rowB.current) rowB.current.style.transform = `translate3d(${((p - 1) * vw * 1.4).toFixed(1)}px, 0, 0)`;
      // the crowd swings round to face you, then drifts
      if (photoRef.current) {
        const t = easeOut(range(p, 0.02, 0.2));
        const ry = lerp(-38, 0, t) + 6 * (p - 0.5);
        const rx = lerp(18, 0, t);
        photoRef.current.style.transform = `translate3d(0, ${(lerp(vh * 0.3, 0, t) - vh * 0.04 * p).toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotate(${(-2 + 3 * p).toFixed(2)}deg) scale(${lerp(0.7, 1, t).toFixed(3)})`;
        photoRef.current.style.setProperty('--lift', (1 - t * 0.8).toFixed(3));
        photoRef.current.style.opacity = Math.min(1, t * 2.5).toFixed(3);
      }
      // tapes slap on one by one; each number counts up as it lands
      rows.forEach((r, i) => {
        const el = tapeRefs.current[i];
        if (!el) return;
        const a = 0.16 + i * 0.16;
        const t = range(p, a, a + 0.1);
        const k = easeOutBack(t);
        const side = TAPE_FROM[i];
        el.style.opacity = Math.min(1, t * 4).toFixed(3);
        el.style.transform = `translate3d(${(side * vw * 0.9 * (1 - k)).toFixed(1)}px, 0, 0) rotate(${(TAPE_TILT[i] + side * 24 * (1 - k)).toFixed(2)}deg) scale(${lerp(1.5, 1, Math.min(1, k)).toFixed(3)})`;
        const count = Math.round(r.n * easeOut(range(p, a + 0.02, a + 0.13)));
        if (shown.current[i] !== count && numRefs.current[i]) {
          shown.current[i] = count;
          numRefs.current[i]!.textContent = count.toLocaleString('en-IN') + (count === r.n ? r.suffix : '');
        }
        const star = starRefs.current[i];
        if (star) {
          const s = range(p, a + 0.08, a + 0.14);
          star.style.opacity = (s > 0 ? 1 : 0).toString();
          star.style.transform = `rotate(${(s * 160).toFixed(1)}deg) scale(${(s > 0 ? easeOutBack(s) : 0).toFixed(3)})`;
        }
      });
    },
    { enabled: full },
  );

  if (!full) {
    return (
      <section id="numbers" className="pg-paper numbers" aria-labelledby="numbers-title">
        <h2 id="numbers-title" className="big" data-sr>
          It kept <span className="hl">going.</span>
        </h2>
        <ul className="numbers__tapes">
          {rows.map((r, i) => (
            <li key={r.small} className={`tape tape--${r.tone} tape--${i % 2 ? 'r' : 'l'}`} data-slap style={{ ['--i' as string]: i }}>
              <span className="tape__big">
                {r.n.toLocaleString('en-IN')}
                {r.suffix}
              </span>
              <span className="tape__small">{r.small}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="numbers" className="pg-paper wall" aria-labelledby="numbers-title">
      <div className="wall__stage">
        <div className="wall__words" aria-hidden="true">
          <div ref={rowA} className="wall__row">20,000 builders · 20,000 builders · 20,000 builders ·</div>
          <div ref={rowB} className="wall__row wall__row--b">every month · every month · every month · every month ·</div>
        </div>

        <h2 ref={headRef} id="numbers-title" className="big wall__head">
          It kept <span className="hl">going.</span>
        </h2>

        <div ref={photoRef} className="wall__photo">
          <Sticker art={art.printCrew} cell={3.2} alt="The AWS User Group Pune crew together at Community Day" />
        </div>

        <ul className="wall__tapes">
          {rows.map((r, i) => (
            <li
              key={r.small}
              ref={(el) => (tapeRefs.current[i] = el)}
              className={`tape tape--${r.tone} wall__tape wall__tape--${i}`}
              aria-label={`${r.n.toLocaleString('en-IN')}${r.suffix} ${r.small}`}
            >
              <span className="tape__big" ref={(el) => (numRefs.current[i] = el)} aria-hidden="true">
                0
              </span>
              <span className="tape__small" aria-hidden="true">
                {r.small}
              </span>
              <div ref={(el) => (starRefs.current[i] = el)} className="wall__pop" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <path d="M60 4 L70 44 L112 40 L78 64 L96 104 L60 80 L24 104 L42 64 L8 40 L50 44 Z" fill="#fff" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
                  <path d="M60 4 L70 44 L112 40 L78 64 L96 104 L60 80 L24 104 L42 64 L8 40 L50 44 Z" fill={i % 2 ? 'var(--blue)' : 'var(--orange)'} />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Numbers;
