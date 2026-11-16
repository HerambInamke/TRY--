import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import StoryLayout from '@/story/StoryLayout';
import Sticker from '@/story/Sticker';
import Team from '@/story/chapters/Team';
import { links } from '@/story/content';
import type { HeaderBrand } from '@/story/StoryHeader';
import { ease, easeOut, lerp, motionMode, range, useScrollScene } from '@/story/scroll-engine';
import JoinFormModal from '@/components/JoinFormModal';
import type { ApplicationRole } from '@/hooks/use-community-applications';
import mark from '@/assets/story/mark.png';
import { hteArt } from './art';

/*
 * Her Tech Era: the Women in Tech branch of AWS User Group Pune, as its own little site.
 * Same photocopy-sticker language as the main site, in the branch's own colours: lavender paper,
 * deep indigo grounds, lilac highlights, with AWS orange kept for small accents.
 */

const WIT_LINKEDIN = 'https://www.linkedin.com/company/aws-ug-for-women-in-tech-india/';
const LEADS = [
  { name: 'Afreen Bano', linkedin: 'https://linkedin.com/in/afreen-bano/' },
  { name: 'Anjali Mishra', linkedin: 'https://linkedin.com/in/anjali-mishra-b221a01ba/' },
];

const stats = [
  { value: '500+', label: 'women reached', detail: 'across meetups and workshops', tone: 'ink' },
  { value: '12+', label: 'WIT sessions', detail: 'hands-on tracks and labs', tone: 'orange' },
  { value: '8+', label: 'women speakers', detail: 'on technical stages and panels', tone: 'blue' },
  { value: '3', label: 'Community Days', detail: 'with flagship tracks', tone: 'white' },
];

const pillars = [
  { num: '01', action: 'Learn', subtitle: 'Without gatekeeping.', description: 'Hands-on sessions, role models, and approachable community spaces help more women build AWS confidence step by step.' },
  { num: '02', action: 'Be seen', subtitle: 'In technical rooms.', description: 'Women in Tech is about being seen as speakers, builders, mentors, organizers, and decision-makers in cloud conversations.' },
  { num: '03', action: 'Connect', subtitle: 'Networks that compound.', description: 'The best communities create friendships, referrals, mentorship, and long-term momentum, not just events.' },
  { num: '04', action: 'Grow', subtitle: 'Mentorship that matters.', description: 'Pairing early-career women with experienced cloud professionals for guidance, portfolio reviews, and career navigation.' },
];

const timeline = [
  { date: 'Mar 2024', title: 'First WIT panel', description: 'Inaugural "Women in Cloud" panel at AWS Community Day Pune with 4 women speakers.' },
  { date: 'Jun 2024', title: 'WIT workshop series', description: 'Hands-on workshop series covering AWS fundamentals, led by women cloud engineers.' },
  { date: 'Sep 2024', title: "It's Her Tech Era launch", description: 'Official branding and LinkedIn campaign launch with community photo features.' },
  { date: 'Dec 2024', title: 'Community Day feature', description: 'Dedicated Women in Tech track at AWS Community Day Pune 2024.' },
  { date: 'Mar 2025', title: 'Growing strong', description: 'Expanded to regular monthly sessions with mentorship pairing program.' },
  { date: 'May 2025', title: 'AWS Community Day 2025', description: 'Women in Tech sessions featured prominently with record participation.' },
  { date: 'Mar 2026', title: 'The Pune chapter kicks off', description: 'Her Tech Era Pune launches at AWS Community Day Pune 2026, led by Afreen Bano and Anjali Mishra.' },
];

const voices = [
  { name: 'Afreen Bano', role: 'Community voice & organizer', quote: 'AWSUG Pune gave me the platform to go from an attendee to a speaker and a community organizer. That progression changed my career trajectory.' },
  { name: 'Priyanka Singh Solanki', role: 'Cloud leadership & architecture', quote: "The Women in Tech initiative here isn't performative — it's practical. Real workshops, real mentors, real outcomes." },
  { name: 'Swaati Deshmukh', role: 'Solutions engineering & mentorship', quote: 'Finding an authentic space where experienced women architects share their production playbooks without hesitation gave me the confidence to take on lead cloud roles.' },
  { name: 'Janhavi Ajmire', role: 'DevOps & community builder', quote: "The hands-on labs broke through the imposter syndrome. You don't just watch slides here; you configure, deploy, debug, and learn with people cheering you on." },
];

const values = [
  { title: 'Purpose-driven', description: 'Every session is designed to build tangible cloud skills, not just fill a diversity checkbox.' },
  { title: 'Builder-first', description: 'We believe in learning by doing: workshops, hackathons, and hands-on labs over passive lectures.' },
  { title: 'Community-centred', description: 'A safe space where questions are encouraged, mistakes are learning, and everyone belongs.' },
  { title: 'Growth-oriented', description: 'From first meetup to first talk, we support every step of the leadership journey.' },
];

const gallery = [
  { art: hteArt.g5, alt: 'Visitors at the Her Tech Era stall at AWS Community Day Pune', cap: 'Community Day' },
  { art: hteArt.g2, alt: 'Two members holding a prize in front of the Her Tech Era standee', cap: 'Prize time' },
  { art: hteArt.g3, alt: 'The Her Tech Era volunteers lined up behind their stall', cap: 'The stall crew' },
  { art: hteArt.g1, alt: 'A quiz winner receiving a gift beside the Her Tech Era banner', cap: 'Quiz winner' },
  { art: hteArt.g4, alt: 'A crowd gathered around the Her Tech Era stall', cap: 'Busy all day' },
  { art: hteArt.g7, alt: 'Women speakers and volunteers on the Community Day stage', cap: 'On stage' },
  { art: hteArt.g6, alt: 'Members holding a prize next to the winged Her Tech Era standee', cap: 'Scaling heights' },
  { art: hteArt.g8, alt: 'The full Community Day crew on stage', cap: 'Everyone' },
];

const ROT = [-3, 2.5, -1.5, 3, -2.5, 1.5, -3.5, 2];

const Star = ({ fill = '#ff9900' }: { fill?: string }) => (
  <svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M60 6 L70 42 L106 34 L82 62 L104 92 L68 80 L58 116 L48 80 L12 90 L36 60 L14 30 L50 42 Z" fill="#fff" stroke="#fff" strokeWidth="12" strokeLinejoin="round" />
    <path d="M60 6 L70 42 L106 34 L82 62 L104 92 L68 80 L58 116 L48 80 L12 90 L36 60 L14 30 L50 42 Z" fill={fill} />
  </svg>
);

/* ── Hero ─────────────────────────────────────────────────── */

const Hero = ({ onJoin }: { onJoin: () => void }) => {
  const full = motionMode() === 'full';
  const ref = useRef<HTMLElement>(null);
  const wingL = useRef<HTMLImageElement>(null);
  const wingR = useRef<HTMLImageElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useScrollScene(
    ref,
    (_p, vh, vw, top) => {
      const t = range(-top, 0, vh); // 0 at rest, 1 when the hero has scrolled away
      const spread = ease(t);
      if (wingL.current) wingL.current.style.transform = `translate3d(${(-spread * vw * 0.35).toFixed(1)}px, ${(-spread * 60).toFixed(1)}px, 0) rotate(${(-spread * 18).toFixed(2)}deg)`;
      if (wingR.current) wingR.current.style.transform = `translate3d(${(spread * vw * 0.35).toFixed(1)}px, ${(-spread * 60).toFixed(1)}px, 0) rotate(${(spread * 18).toFixed(2)}deg)`;
      if (photo.current) {
        photo.current.style.transform = `translate3d(0, ${(-t * vh * 0.04).toFixed(1)}px, 0) rotate(${lerp(4, 9, t).toFixed(2)}deg)`;
        photo.current.style.setProperty('--lift', lerp(0.2, 1, easeOut(t)).toFixed(3));
      }
      if (title.current) title.current.style.transform = `translate3d(0, ${(t * vh * 0.1).toFixed(1)}px, 0) scale(${lerp(1, 0.92, t).toFixed(3)})`;
    },
    { enabled: full, margin: 0.2 },
  );

  return (
    <section ref={ref} className="pg-blue h-hero" aria-labelledby="h-title">
      <p className="dymo dymo--orange h-hero__kicker">The Pune chapter of AWS User Group Women in Tech India</p>
      <div className="h-hero__emblem">
        <img ref={wingL} className="h-hero__wing h-hero__wing--l" src="/wings/right_wing.svg" alt="" aria-hidden="true" />
        <h1 id="h-title" ref={title} className="h-hero__title">
          Her
          <br />
          Tech
          <br />
          Era
        </h1>
        <img ref={wingR} className="h-hero__wing h-hero__wing--r" src="/wings/left_wing.svg" alt="" aria-hidden="true" />
      </div>
      <p className="h-hero__tag">Scaling heights. Building dreams.</p>
      <div className="h-hero__row">
        <div ref={photo} className="h-hero__photo">
          <Sticker art={hteArt.g6} eager alt="Two members with a prize beside the winged Her Tech Era standee" />
          <div className="h-hero__star">
            <Star />
          </div>
        </div>
        <div className="h-hero__side">
          <p className="h-hero__lead">
            Workshops, mentorship and a stage for women in cloud, AI and DevOps. Powered by{' '}
            <Link to="/">AWS User Group Pune</Link>.
          </p>
          <div className="h-hero__kickoff">
            <span className="dymo dymo--orange dymo--sm">Kicked off at AWS Community Day Pune 2026</span>
            <p>
              The Pune chapter of Her Tech Era started at ACD 2026 and is led by{' '}
              <a href={LEADS[0].linkedin} target="_blank" rel="noopener noreferrer">{LEADS[0].name}</a> and{' '}
              <a href={LEADS[1].linkedin} target="_blank" rel="noopener noreferrer">{LEADS[1].name}</a>.
            </p>
          </div>
          <p className="dymo dymo--sm h-hero__recap">Thank you, Pune · 18 Oct 2026 recap</p>
          <div className="h-hero__cta">
            <button type="button" className="btn btn--orange" onClick={onJoin}>
              Join Her Tech Era <span aria-hidden="true">→</span>
            </button>
            <a className="btn btn--ghost" href={WIT_LINKEDIN} target="_blank" rel="noopener noreferrer">
              Follow on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Journey: a tape that pulls out as you scroll ─────────── */

const Journey = () => {
  const full = motionMode() === 'full';
  const ref = useRef<HTMLElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  useScrollScene(
    ref,
    (_p, vh, _vw, top, height) => {
      if (!fill.current) return;
      const t = range(vh * 0.6 - top, 0, height - vh * 0.2);
      fill.current.style.transform = `scaleY(${t.toFixed(4)})`;
    },
    { enabled: full, margin: 0.2 },
  );
  return (
    <section ref={ref} id="journey" className="pg-paper h-journey" aria-labelledby="journey-title">
      <p className="dymo" data-sr>
        Our journey
      </p>
      <h2 id="journey-title" className="big" data-sr>
        From one panel to a <span className="hl">movement.</span>
      </h2>
      <p className="lead" data-sr>
        An intentional evolution from a single panel into a year-round community across cloud, AI and DevOps.
      </p>
      <div className="h-journey__track">
        <div className="h-journey__line" aria-hidden="true">
          <div ref={fill} className="h-journey__fill" style={full ? undefined : { transform: 'none' }} />
        </div>
        <ol className="h-journey__list">
          {timeline.map((m, i) => (
            <li key={m.date} className={`h-journey__item h-journey__item--${i % 2 ? 'r' : 'l'}`} data-slap style={{ ['--rot' as string]: `${ROT[i]}deg` }}>
              <span className="dymo dymo--sm">{m.date}</span>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
            </li>
          ))}
          <li className="h-journey__now" data-slap style={{ ['--rot' as string]: '-1deg' }}>
            <span className="dymo dymo--orange dymo--sm">Where we are now</span>
            <h3>A continuous, compounding community of women in technology.</h3>
            <p>From our first panel to regular technical tracks, workshops and flagship Community Days, building confidence, visibility and leadership all year.</p>
          </li>
        </ol>
      </div>
    </section>
  );
};

/* ── The page ─────────────────────────────────────────────── */

const HerTechEraSite = () => {
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinRole, setJoinRole] = useState<ApplicationRole | undefined>();
  const openJoin = (role?: ApplicationRole) => {
    setJoinRole(role);
    setJoinOpen(true);
  };

  const brand: HeaderBrand = {
    home: '/her-tech-era',
    badge: (
      <>
        <img src={mark} alt="" width={26} height={30} />
        <span>Her Tech Era</span>
      </>
    ),
    badgeLabel: 'Her Tech Era, top of the page',
    menuHead: 'Her Tech Era. Pick a sticker.',
    chapters: [
      { id: 'mission', label: 'Mission' },
      { id: 'gallery', label: 'In action' },
      { id: 'journey', label: 'Journey' },
      { id: 'voices', label: 'Voices' },
      { id: 'people', label: 'The crew' },
      { id: 'join', label: 'Join' },
      { id: 'awsug', label: '← AWSUG Pune', href: '/' },
    ],
    star: { label: 'Join', aria: 'Join Her Tech Era', onClick: () => openJoin() },
    foot: [
      { label: 'LinkedIn', href: WIT_LINKEDIN, newTab: true },
      { label: 'Meetup', href: links.meetup, newTab: true },
      { label: 'AWSUG Pune', href: '/' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Her Tech Era — AWS User Group Pune | Scaling Heights, Building Dreams</title>
        <meta name="description" content="Her Tech Era is the Pune Chapter of AWS User Group Women in Tech India: workshops, mentorship, and speaking opportunities for women in cloud, AI, and DevOps." />
        <link rel="canonical" href="https://www.awsugpune.in/her-tech-era" />
        <meta property="og:url" content="https://www.awsugpune.in/her-tech-era" />
        <meta property="og:title" content="Her Tech Era — AWS User Group Pune" />
        <meta property="og:description" content="The Pune Chapter of AWS User Group Women in Tech India. Powered by AWS User Group Pune." />
        <meta property="og:image" content="https://www.awsugpune.in/her-tech-era-photos/DSC06464.JPG" />
        <meta name="twitter:title" content="Her Tech Era — AWS User Group Pune" />
        <meta name="twitter:image" content="https://www.awsugpune.in/her-tech-era-photos/DSC06464.JPG" />
      </Helmet>

      <StoryLayout brand={brand} theme="hte" themeColor="#2a1b5c" footer={<HteFooter />}>
        <Hero onJoin={() => openJoin()} />

        <section className="pg-paper h-stats" aria-label="Her Tech Era in numbers">
          <ul className="h-stats__list">
            {stats.map((s, i) => (
              <li key={s.label} className={`tape tape--${s.tone} h-stats__tape`} data-slap style={{ ['--rot' as string]: `${ROT[i]}deg` }}>
                <span className="tape__big">{s.value}</span>
                <span className="tape__small">
                  {s.label}
                  <small>{s.detail}</small>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="mission" className="pg-ink h-mission" aria-labelledby="mission-title">
          <p className="dymo dymo--orange" data-sr>
            What we stand for
          </p>
          <h2 id="mission-title" className="big" data-sr>
            Four ideas. <span className="hl">One direction.</span>
          </h2>
          <ol className="h-mission__list">
            {pillars.map((p, i) => (
              <li key={p.num} className="h-note" data-slap style={{ ['--rot' as string]: `${ROT[i + 2]}deg` }}>
                <span className="h-note__num">{p.num}</span>
                <span className="dymo dymo--sm">{p.action}</span>
                <h3>{p.subtitle}</h3>
                <p>{p.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="gallery" className="pg-blue h-gallery" aria-labelledby="gallery-title">
          <p className="dymo dymo--orange" data-sr>
            Documentary &amp; archive
          </p>
          <h2 id="gallery-title" className="big big--paper" data-sr>
            Her Tech Era, <span className="hl">in action.</span>
          </h2>
          <div className="h-gallery__wall">
            {gallery.map((g, i) => (
              <figure key={g.cap} className={`paste h-gallery__item h-gallery__item--${i}`} data-slap style={{ ['--rot' as string]: `${ROT[i]}deg` }}>
                <Sticker art={g.art} alt={g.alt} />
                <figcaption className="dymo dymo--sm">{g.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <Journey />

        <section id="voices" className="pg-ink h-voices" aria-labelledby="voices-title">
          <p className="dymo dymo--orange" data-sr>
            Community voices
          </p>
          <h2 id="voices-title" className="big" data-sr>
            Real conversations, <span className="hl">shared journeys.</span>
          </h2>
          <ul className="h-voices__list" aria-label="Quotes from members">
            {voices.map((v, i) => (
              <li key={v.name} className="h-voice" data-slap style={{ ['--rot' as string]: `${ROT[i + 1]}deg` }}>
                <blockquote>
                  <p>&ldquo;{v.quote}&rdquo;</p>
                </blockquote>
                <p className="h-voice__who">
                  <span className="dymo dymo--sm">{v.name}</span>
                  <span>{v.role}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="pg-paper h-values" aria-labelledby="values-title">
          <p className="dymo" data-sr>
            Our philosophy
          </p>
          <h2 id="values-title" className="big" data-sr>
            What drives <span className="hl">this.</span>
          </h2>
          <ol className="h-values__list">
            {values.map((v, i) => (
              <li key={v.title} data-sr>
                <span className="h-values__n">0{i + 1}</span>
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Team />

        <section id="join" className="pg-blue h-join" aria-labelledby="h-join-title">
          <p className="dymo dymo--orange" data-sr>
            Learn · Build · Connect · Lead
          </p>
          <h2 id="h-join-title" className="big big--paper" data-sr>
            Your era <span className="hl">starts here.</span>
          </h2>
          <p className="lead lead--paper" data-sr>
            Whether you want to speak at a technical track, volunteer, or simply find your community, there is a seat waiting for you.
          </p>
          <div className="h-join__actions" data-sr>
            <button type="button" className="btn btn--orange btn--block" onClick={() => openJoin()}>
              Join the community <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="btn btn--paper" onClick={() => openJoin('speaker')}>
              Speak at a session
            </button>
            <button type="button" className="btn btn--paper" onClick={() => openJoin('volunteer')}>
              Volunteer
            </button>
          </div>
        </section>
      </StoryLayout>

      <JoinFormModal open={joinOpen} onClose={() => setJoinOpen(false)} initialRole={joinRole} />
    </>
  );
};

const HteFooter = () => (
  <footer className="foot" aria-label="Site footer">
    <p className="foot__big" aria-hidden="true">
      Her Tech <span>Era</span>
    </p>
    <div className="foot__row">
      <span className="wordmark">
        <img src={mark} alt="" width={26} height={30} />
        <span>A branch of AWS User Group Pune</span>
      </span>
      <nav className="foot__links" aria-label="Elsewhere">
        <a href={WIT_LINKEDIN} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={links.meetup} target="_blank" rel="noopener noreferrer">
          Meetup
        </a>
        <Link to="/">AWSUG Pune</Link>
        <a href={`mailto:${links.email}`}>{links.email}</a>
        <Link to="/dashboard/login">Member login</Link>
      </nav>
    </div>
    <div className="foot__meta">
      <span>© {new Date().getFullYear()} AWS User Group Pune · Her Tech Era</span>
    </div>
  </footer>
);

export default HerTechEraSite;
