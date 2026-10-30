import { useRef } from 'react';
import Sticker from '../Sticker';
import { art } from '../art';
import { ease, easeOut, lerp, motionMode, range, useScrollScene } from '../scroll-engine';

const rooms = [
  {
    art: art.printStage,
    alt: 'A speaker presenting AWS Inspector to a packed meetup room',
    label: 'Talks',
    title: 'Learn from people who ship',
    body: 'Practitioners walk through real builds on AWS: serverless, containers, data, security and GenAI.',
  },
  {
    art: art.printLab,
    alt: 'Attendees with laptops during a hands-on workshop',
    label: 'Labs',
    title: 'Build it in the room',
    body: 'Bring a laptop, leave with something running. Mentors stay close to get you unstuck.',
  },
  {
    art: art.printAcd,
    alt: 'Volunteers and speakers at AWS Community Day Pune 2026',
    label: 'Community Day',
    title: '700+ in one hall',
    body: 'Our flagship conference. In 2026: 700+ builders, 20+ speakers and a full day of tracks.',
  },
];

const REST_TILT = [-3, 4, -6];
const PEEL = [
  [0.2, 0.44],
  [0.5, 0.74],
];

/**
 * A stack of three photocopied stickers. Scrolling peels the top one off by its corner, it lifts,
 * curls and flies away, and the next one is underneath with its own label. The words swap with it.
 */
const Rooms = () => {
  const full = motionMode() === 'full';
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const lastIdx = useRef(-1);

  useScrollScene(
    sectionRef,
    (p, vh, vw) => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const win = PEEL[i];
        const rest = REST_TILT[i];
        if (!win) {
          // the last card: settles a touch when it is uncovered
          const t = easeOut(range(p, 0.68, 0.8));
          el.style.transform = `rotate(${lerp(rest, -1.5, t).toFixed(2)}deg)`;
          return;
        }
        const t = range(p, win[0], win[1]);
        const lift = ease(range(t, 0, 0.35)); // corner lifts and the card bends back
        const fly = ease(range(t, 0.3, 1)); // then it is pulled away
        const x = fly * vw * 1.15;
        const y = -lift * 18 - fly * vh * 0.35;
        const ry = -lift * 34 - fly * 20;
        const rz = rest + lift * 7 + fly * 34;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${(lift * 60).toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${(lift * 10).toFixed(2)}deg) rotate(${rz.toFixed(2)}deg)`;
        el.style.setProperty('--lift', (0.18 + lift * 0.82).toFixed(3));
        el.style.setProperty('--curl', lift.toFixed(3));
        el.style.opacity = (1 - range(t, 0.85, 1)).toFixed(3);
      });
      // which room is on top decides the words
      const idx = p < PEEL[0][0] + 0.12 ? 0 : p < PEEL[1][0] + 0.12 ? 1 : 2;
      if (idx !== lastIdx.current) {
        lastIdx.current = idx;
        textRefs.current.forEach((el, i) => el?.classList.toggle('is-on', i === idx));
        if (countRef.current) countRef.current.textContent = `0${idx + 1}`;
        dotsRef.current?.querySelectorAll('i').forEach((d, i) => d.classList.toggle('is-on', i <= idx));
      }
    },
    { enabled: full },
  );

  if (!full) {
    return (
      <section id="what-we-do" className="pg-blue rooms" aria-labelledby="rooms-title">
        <h2 id="rooms-title" className="big big--paper" data-sr>
          What happens <span className="hl hl--ink">inside.</span>
        </h2>
        <ol className="rooms__list">
          {rooms.map((r, i) => (
            <li key={r.label} className={`room room--${i}`}>
              <figure className="paste" data-slap>
                <Sticker art={r.art} alt={r.alt} />
                <figcaption className="dymo dymo--sm">{r.label}</figcaption>
              </figure>
              <div className="room__text" data-sr>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="what-we-do" className="pg-blue deck" aria-labelledby="rooms-title">
      <div className="deck__stage">
        <h2 id="rooms-title" className="big big--paper deck__head">
          What happens <span className="hl hl--ink">inside.</span>
        </h2>

        <div className="deck__pile">
          {rooms
            .map((r, i) => (
              <div
                key={r.label}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`deck__card deck__card--${i}`}
                style={{ transform: `rotate(${REST_TILT[i]}deg)`, zIndex: 10 - i }}
              >
                <Sticker art={r.art} alt={r.alt} eager={i === 0} />
                <span className="dymo dymo--sm deck__tag">{r.label}</span>
                <span className="deck__curl" aria-hidden="true" />
              </div>
            ))}
        </div>

        <div className="deck__words">
          <p className="deck__count dymo dymo--sm" aria-hidden="true">
            <span ref={countRef}>01</span> / 03
          </p>
          {rooms.map((r, i) => (
            <div key={r.label} ref={(el) => (textRefs.current[i] = el)} className={`deck__text${i === 0 ? ' is-on' : ''}`}>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </div>
          ))}
          <div ref={dotsRef} className="deck__dots" aria-hidden="true">
            <i className="is-on" />
            <i />
            <i />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rooms;
