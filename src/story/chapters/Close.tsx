import { useState } from 'react';
import { z } from 'zod';
import { addNewsletterSubscriber } from '@/lib/firestore';
import Sticker from '../Sticker';
import { art } from '../art';
import { links } from '../content';
import { useNextEvent } from '../next-event';

/**
 * The sticker that fills the "your sticker goes here" slot: a die-cut AWSUG Pune member sticker.
 * A white cloud-shaped backing (the die cut), AWS orange on top, the halftone fort stuck on its
 * corner. It slaps into the slot as the chapter arrives, lifts on hover, wobbles when tapped, and
 * says YOU'RE IN once someone signs up.
 */
const CLOUD = (
  <>
    <rect x="44" y="70" width="312" height="118" rx="58" />
    <circle cx="112" cy="86" r="54" />
    <circle cx="198" cy="66" r="62" />
    <circle cx="292" cy="88" r="52" />
    <circle cx="82" cy="150" r="46" />
    <circle cx="324" cy="150" r="46" />
    <circle cx="200" cy="182" r="48" />
    <circle cx="136" cy="176" r="40" />
    <circle cx="268" cy="178" r="40" />
  </>
);

const JoinSticker = ({ joined }: { joined: boolean }) => {
  const [wobble, setWobble] = useState(0);
  return (
    <button
      type="button"
      className={`jstk${wobble ? ' is-wobble' : ''}`}
      key={wobble}
      onClick={() => setWobble((n) => n + 1)}
      aria-label={joined ? 'Your AWSUG Pune sticker: you are in' : 'An AWSUG Pune sticker: I am in'}
    >
      <svg className="jstk__shape" viewBox="0 0 400 240" aria-hidden="true">
        <defs>
          <pattern id="jstk-dots" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="3.5" cy="3.5" r="1.5" fill="rgba(20, 18, 16, 0.16)" />
          </pattern>
        </defs>
        <g className="jstk__cut">{CLOUD}</g>
        <g className="jstk__face">{CLOUD}</g>
        <g className="jstk__dots">{CLOUD}</g>
      </svg>
      <span className="jstk__text" aria-hidden="true">
        <span className="jstk__big">{joined ? 'You’re in!' : 'I’m in!'}</span>
        <span className="jstk__tape">AWS User Group Pune</span>
        <span className="jstk__small">Every month since 2019</span>
      </span>
      <span className="jstk__fort" aria-hidden="true">
        <Sticker art={art.fort} cell={2.6} />
      </span>
      <svg className="jstk__star" viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 4 L71 40 L108 30 L84 60 L108 90 L71 80 L60 116 L49 80 L12 90 L36 60 L12 30 L49 40 Z" fill="#fff" stroke="#fff" strokeWidth="14" strokeLinejoin="round" />
        <path d="M60 4 L71 40 L108 30 L84 60 L108 90 L71 80 L60 116 L49 80 L12 90 L36 60 L12 30 L49 40 Z" fill="#3f6fd8" />
      </svg>
    </button>
  );
};

const email = z.string().trim().email();

const Close = () => {
  const next = useNextEvent();
  const [value, setValue] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'invalid' | 'failed'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = email.safeParse(value);
    if (!parsed.success) {
      setState('invalid');
      return;
    }
    setState('sending');
    const ok = await addNewsletterSubscriber({ email: parsed.data });
    setState(ok ? 'done' : 'failed');
  };

  const message = {
    idle: '',
    sending: 'Adding you…',
    done: 'You’re in. The next invite will reach your inbox.',
    invalid: 'That doesn’t look like an email address.',
    failed: 'We couldn’t save that just now. Joining on Meetup works too.',
  }[state];

  return (
    <section id="join" className="pg-blue join" aria-labelledby="join-title">
      <div className="join__slot">
        <span className="join__slot-text" aria-hidden="true">
          Your sticker goes here
        </span>
        <div className="join__place" data-slap style={{ ['--rot' as string]: '-5deg', ['--i' as string]: 2 }}>
          <JoinSticker joined={state === 'done'} />
        </div>
      </div>
      <h2 id="join-title" className="big big--paper" data-sr>
        Next month, <span className="hl hl--ink">you&rsquo;re in.</span>
      </h2>
      <p className="lead lead--paper" data-sr>
        Join us on Meetup for every invite, or leave your email and we&rsquo;ll send you the next one.
      </p>

      {next && (
        <a className="dymo dymo--orange join__next" href={next.link || next.meetupLink} target="_blank" rel="noopener noreferrer">
          Next up: {next.message}, {next.date}
        </a>
      )}

      <div className="join__actions" data-sr>
        <a className="btn btn--orange btn--block" href={links.meetup} target="_blank" rel="noopener noreferrer">
          Join on Meetup <span aria-hidden="true">→</span>
        </a>
        {state === 'done' ? (
          <p className="form__msg" role="status">
            {message}
          </p>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate>
            <label htmlFor="story-email">Or get the next invite by email</label>
            <div className="form__row">
              <input
                id="story-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (state === 'invalid' || state === 'failed') setState('idle');
                }}
                aria-invalid={state === 'invalid'}
                aria-describedby="story-email-msg"
              />
              <button type="submit" className="btn btn--ink" disabled={state === 'sending'}>
                Subscribe
              </button>
            </div>
            <p id="story-email-msg" className="form__msg" role="status">
              {message}
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default Close;
