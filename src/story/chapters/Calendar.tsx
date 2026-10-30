import { useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { FIRST_MEETUP, milestones } from '../content';
import { useScrollScene } from '../scroll-engine';

const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Calendar = () => {
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  const { years, total, nowIndex } = useMemo(() => {
    const now = new Date();
    const endYear = now.getFullYear();
    const endMonth = now.getMonth();
    const list: { year: number; months: { m: number; index: number | null }[] }[] = [];
    let index = 0;
    let nowIdx = 0;
    for (let y = FIRST_MEETUP.year; y <= endYear; y++) {
      const months = Array.from({ length: 12 }, (_, m) => {
        const before = y === FIRST_MEETUP.year && m < FIRST_MEETUP.month;
        const after = y === endYear && m > endMonth;
        if (before || after) return { m, index: null };
        if (y === endYear && m === endMonth) nowIdx = index;
        return { m, index: index++ };
      });
      list.push({ year: y, months });
    }
    return { years: list, total: index, nowIndex: nowIdx };
  }, []);

  // The months light up, in order, as the grid passes through the screen
  const [lit, setLit] = useState(reduced ? total : 0);
  // from the grid's top at 92% of the screen to its bottom at 55%
  useScrollScene(
    gridRef,
    (_p, vh, _vw, top, height) => {
      const p = (vh * 0.92 - top) / Math.max(1, vh * 0.37 + height);
      const next = Math.round(Math.min(1, Math.max(0, p)) * total);
      setLit((cur) => (cur === next ? cur : next));
    },
    { enabled: !reduced, margin: 0.2 },
  );
  const shown = reduced ? total : lit;

  const [selected, setSelected] = useState<number>(milestones[milestones.length - 1].year);
  const milestone = milestones.find((m) => m.year === selected);
  const now = new Date();

  return (
    <section id="every-month" className="pg-paper cal" aria-labelledby="cal-title">
      <div className="s-cal">
        <div className="s-cal__intro">
          <p className="dymo dymo--orange" data-sr>
            Notice board
          </p>
          <h2 id="cal-title" className="big" data-sr>
            {total} months, <span className="hl">no gaps.</span>
          </h2>
          <p className="lead" data-sr style={{ ['--i' as string]: 1 }}>
            Every square is a month since the first meetup, up to this one. Tap an underlined year to see what changed
            that year.
          </p>
        </div>

        <div className="s-cal__board">
          <div
            ref={gridRef}
            className="s-cal__grid"
            role="img"
            aria-label={`${total} months from June 2019 to ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`}
          >
            <span aria-hidden="true" />
            {MONTH_LABELS.map((l, i) => (
              <span key={i} className="s-cal__mlabel" aria-hidden="true">
                {l}
              </span>
            ))}
            {years.map(({ year, months }) => {
              const ms = milestones.some((m) => m.year === year);
              return (
                <YearRow
                  key={year}
                  year={year}
                  months={months}
                  shown={shown}
                  nowIndex={nowIndex}
                  isMilestone={ms}
                  active={ms && selected === year}
                  onSelect={() => setSelected(year)}
                />
              );
            })}
          </div>

          <div className="s-cal__note" aria-live="polite">
            {milestone && (
              <>
                <span className="s-cal__note-year">{milestone.year}</span>
                <span className="s-cal__note-title">{milestone.title}</span>
                <span className="s-cal__note-detail">{milestone.detail}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const YearRow = ({
  year,
  months,
  shown,
  nowIndex,
  isMilestone,
  active,
  onSelect,
}: {
  year: number;
  months: { m: number; index: number | null }[];
  shown: number;
  nowIndex: number;
  isMilestone: boolean;
  active: boolean;
  onSelect: () => void;
}) => (
  <>
    {isMilestone ? (
      <button type="button" className="s-cal__year" data-milestone="true" aria-pressed={active} onClick={onSelect}>
        {year}
      </button>
    ) : (
      <span className="s-cal__year">{year}</span>
    )}
    {months.map(({ m, index }) => (
      <span
        key={m}
        className="s-cal__cell"
        aria-hidden="true"
        data-empty={index === null}
        data-lit={index !== null && index < shown}
        data-hot={active && index !== null}
        data-now={index === nowIndex}
      />
    ))}
  </>
);

export default Calendar;
