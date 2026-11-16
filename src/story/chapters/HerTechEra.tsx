import { useRef } from 'react';
import Sticker from '../Sticker';
import { art } from '../art';
import { easeOut, lerp, motionMode, range, useScrollScene } from '../scroll-engine';

const Star = ({ fill }: { fill: string }) => (
  <svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M60 6 L70 42 L106 34 L82 62 L104 92 L68 80 L58 116 L48 80 L12 90 L36 60 L14 30 L50 42 Z" fill="#fff" stroke="#fff" strokeWidth="12" strokeLinejoin="round" />
    <path d="M60 6 L70 42 L106 34 L82 62 L104 92 L68 80 L58 116 L48 80 L12 90 L36 60 L14 30 L50 42 Z" fill={fill} />
  </svg>
);

/**
 * Her Tech Era is its own branch with its own site, so it gets its own world here: a violet
 * pop-up book. As you reach it, the page pops up off the spread towards you, stars spring out, and the
 * button opens the Her Tech Era site in a new tab.
 */
const HerTechEra = () => {
  const full = motionMode() === 'full';
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const popRefs = useRef<Array<HTMLDivElement | null>>([]);

  useScrollScene(
    sectionRef,
    (_p, vh, _vw, top) => {
      // 0 when the chapter's top is at the bottom of the screen, 1 when it is a third of the way up
      const t = range(vh - top, vh * 0.15, vh * 0.85);
      const k = easeOut(t);
      if (cardRef.current) {
        const bounce = Math.sin(range(t, 0.82, 1) * Math.PI) * 3;
        cardRef.current.style.transform = `rotateX(${(lerp(88, 0, k) - bounce).toFixed(2)}deg)`;
      }
      if (shadowRef.current) shadowRef.current.style.opacity = lerp(0.1, 0.55, k).toFixed(3);
      popRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = range(t, 0.7 + i * 0.07, 0.85 + i * 0.07);
        const b = s <= 0 ? 0 : 1 + 2.7 * Math.pow(s - 1, 3) + 1.7 * Math.pow(s - 1, 2);
        el.style.transform = `translate3d(0, ${(-40 * b).toFixed(1)}px, ${(60 * b).toFixed(1)}px) rotate(${(i * 40 + s * 120).toFixed(1)}deg) scale(${b.toFixed(3)})`;
      });
    },
    { enabled: full, margin: 0.3 },
  );

  return (
    <section ref={sectionRef} id="her-tech-era" className={`portal${full ? '' : ' portal--still'}`} aria-labelledby="hte-title">
      <p className="portal__kicker dymo dymo--sm">A branch of AWSUG Pune</p>
      <div className="portal__book">
        <div className="portal__spread" aria-hidden="true" />
        <div ref={shadowRef} className="portal__shadow" aria-hidden="true" />
        <div ref={cardRef} className="portal__card">
          <div className="portal__photo">
            <Sticker art={art.printHte} alt="A member holding an I love AWS sign beside the Her Tech Era standee" />
          </div>
          <div className="portal__text">
            <h2 id="hte-title" className="portal__title">
              Her
              <br />
              Tech
              <br />
              Era
            </h2>
            <p className="portal__tag">Scaling heights. Building dreams.</p>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} ref={(el) => (popRefs.current[i] = el)} className={`portal__pop portal__pop--${i}`} aria-hidden="true">
              <Star fill={i === 1 ? '#ff9900' : '#a48cf5'} />
            </div>
          ))}
        </div>
      </div>
      <p className="portal__lead">
        The Pune chapter of AWS User Group Women in Tech India: workshops, mentorship and a stage for women in cloud, AI and
        DevOps. It has its own site.
      </p>
      <a className="btn portal__btn" href="/her-tech-era" target="_blank" rel="noopener">
        Enter Her Tech Era <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  );
};

export default HerTechEra;
