import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowUpRight, GraduationCap, Handshake, MicVocal,
  Sparkles, Calendar, Mic2, HandHeart, MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import JoinFormModal from '@/components/JoinFormModal';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { fadeUp, staggerContainer, pageTransition } from '@/lib/motion-variants';
import { type ApplicationRole } from '@/hooks/use-community-applications';
import afreenBano from '@/assets/panelist/Afreen Bano.jpeg';
import priyankaSinghSolanki from '@/assets/panelist/Priyanka Singh Solanki.jpeg';
// import wingsSvg from '@/assets/wings.svg';

/*
 * ── Standee color palette ─────────────────────────────────────
 * Dark:   #3B3242 (edges)
 * Mid:    #6D64AD (accent purple)
 * Bright: #9361A1 (center glow)
 * Deep:   #483184 (bottom indigo)
 */

const heroStats = [
  { value: '500+', label: 'Women Reached', detail: 'Across community meetups & workshops' },
  { value: '12+', label: 'WIT Sessions', detail: 'Hands-on tracks & learning labs' },
  { value: '8+', label: 'Women Speakers', detail: 'On technical stages & panels' },
  { value: '3', label: 'Community Days', detail: 'Flagship conference tracks' },
];

const heroParticles = [
  { top: '16%', left: '14%', size: 3, delay: 0, duration: 6 },
  { top: '24%', left: '22%', size: 4, delay: 1.2, duration: 7 },
  { top: '38%', left: '10%', size: 5, delay: 2.4, duration: 8 },
  { top: '18%', left: '82%', size: 3, delay: 0.6, duration: 6.5 },
  { top: '30%', left: '90%', size: 4, delay: 1.8, duration: 7.5 },
  { top: '44%', left: '76%', size: 5, delay: 2.7, duration: 8.5 },
  { top: '56%', left: '18%', size: 3, delay: 3.2, duration: 6 },
  { top: '64%', left: '84%', size: 4, delay: 1.5, duration: 7.2 },
  { top: '72%', left: '28%', size: 3, delay: 2.9, duration: 8.8 },
  { top: '76%', left: '72%', size: 4, delay: 0.8, duration: 7.8 },
  { top: '12%', left: '46%', size: 2, delay: 1.9, duration: 6.2 },
  { top: '48%', left: '32%', size: 3, delay: 2.1, duration: 7.4 },
  { top: '50%', left: '68%', size: 3, delay: 3.4, duration: 8.1 },
  { top: '68%', left: '50%', size: 2.5, delay: 1.1, duration: 6.9 },
];

const pillars = [
  {
    num: '01',
    phase: 'Phase I',
    action: 'LEARN',
    subtitle: 'Without gatekeeping.',
    description:
      'Hands-on sessions, role models, and approachable community spaces help more women build AWS confidence step by step.',
  },
  {
    num: '02',
    phase: 'Phase II',
    action: 'BE SEEN',
    subtitle: 'In technical rooms.',
    description:
      'Women in Tech is about being seen as speakers, builders, mentors, organizers, and decision-makers in cloud conversations.',
  },
  {
    num: '03',
    phase: 'Phase III',
    action: 'CONNECT',
    subtitle: 'Networks that compound.',
    description:
      'The best communities create friendships, referrals, mentorship, and long-term momentum — not just events.',
  },
  {
    num: '04',
    phase: 'Phase IV',
    action: 'GROW',
    subtitle: 'Mentorship that matters.',
    description:
      'Pairing early-career women with experienced cloud professionals for guidance, portfolio reviews, and career navigation.',
  },
];

const timeline = [
  { date: 'Mar 2024', title: 'First WIT Panel', description: 'Inaugural "Women in Cloud" panel at AWS Community Day Pune with 4 women speakers.' },
  { date: 'Jun 2024', title: 'WIT Workshop Series', description: 'Hands-on workshop series covering AWS fundamentals, led by women cloud engineers.' },
  { date: 'Sep 2024', title: "It's Her Tech Era Launch", description: 'Official branding and LinkedIn campaign launch with community photo features.' },
  { date: 'Dec 2024', title: 'Community Day Feature', description: 'Dedicated Women in Tech track at AWS Community Day Pune 2024.' },
  { date: 'Mar 2025', title: 'Growing Strong', description: 'Expanded to regular monthly sessions with mentorship pairing program.' },
  { date: 'May 2025', title: 'AWS Community Day 2025', description: 'Women in Tech sessions featured prominently with record participation.' },
];

const voices = [
  {
    name: 'Afreen Bano',
    role: 'Community Voice & Organizer',
    image: afreenBano,
    quote: 'AWSUG Pune gave me the platform to go from an attendee to a speaker and a community organizer. That progression changed my career trajectory.',
  },
  {
    name: 'Priyanka Singh Solanki',
    role: 'Cloud Leadership & Architecture',
    image: priyankaSinghSolanki,
    quote: "The Women in Tech initiative here isn't performative — it's practical. Real workshops, real mentors, real outcomes.",
  },
  {
    name: 'Swaati Deshmukh',
    role: 'Solutions Engineering & Mentorship',
    image: '/her-tech-era-photos/DSC06462.JPG',
    quote: 'Finding an authentic space where experienced women architects share their production playbooks without hesitation gave me the confidence to take on lead cloud roles.',
  },
  {
    name: 'Janhavi Ajmire',
    role: 'DevOps & Community Builder',
    image: '/her-tech-era-photos/20260321_154530.jpg',
    quote: "The hands-on labs broke through the imposter syndrome. You don't just watch slides here; you configure, deploy, debug, and learn with people cheering you on.",
  },
];

const values = [
  {
    step: '01',
    title: 'PURPOSE-DRIVEN',
    description: 'Every session is designed to build tangible cloud skills, not just fill a diversity checkbox.',
  },
  {
    step: '02',
    title: 'BUILDER-FIRST',
    description: 'We believe in learning by doing — workshops, hackathons, and hands-on labs over passive lectures.',
  },
  {
    step: '03',
    title: 'COMMUNITY-CENTERED',
    description: 'A safe space where questions are encouraged, mistakes are learning, and everyone belongs.',
  },
  {
    step: '04',
    title: 'GROWTH-ORIENTED',
    description: 'From first meetup to first talk — we support every step of the leadership journey.',
  },
];

const defaultGalleryImages = [
  "20260321_154226.jpg",
  "20260321_154349.jpg",
  "20260321_154530.jpg",
  "DSC06462.JPG",
  "DSC06464.JPG",
  "IMG_0002.jpg",
  "IMG_9979.jpg",
  "WhatsApp Image 2026-03-22 at 12.33.25.jpeg",
  "_DSC5641.JPG"
];

interface MilestoneData {
  date: string;
  title: string;
  description: string;
}

const TimelineMilestone = ({
  item,
  index,
  total,
  scrollYProgress,
  reducedMotion,
}: {
  item: MilestoneData;
  index: number;
  total: number;
  scrollYProgress: any;
  reducedMotion: boolean;
}) => {
  const isEven = index % 2 === 0;

  // Milestone activation range
  const threshold = index / Math.max(1, total - 1);
  const startActivation = Math.max(0, threshold - 0.12);
  const fullActivation = Math.min(1, threshold + 0.05);

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, startActivation - 0.15), startActivation, fullActivation],
    [0.35, 0.7, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [startActivation, fullActivation],
    [18, 0]
  );

  const nodeScale = useTransform(
    scrollYProgress,
    [startActivation, threshold, fullActivation],
    [0.85, 1.25, 1]
  );

  const nodeGlow = useTransform(
    scrollYProgress,
    [startActivation, threshold, fullActivation],
    [0.3, 1, 0.75]
  );

  return (
    <div
      className={`relative flex items-center gap-6 pb-20 md:pb-28 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Central Milestone Node on the glowing spine */}
      <div className="absolute left-4 md:left-1/2 top-4 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
        <motion.div
          style={reducedMotion ? {} : { scale: nodeScale }}
          className="relative flex items-center justify-center"
        >
          {/* Outer halo */}
          <motion.div
            style={reducedMotion ? {} : { opacity: nodeGlow }}
            className="h-7 w-7 rounded-full border border-purple-400/50 bg-[#09050E] flex items-center justify-center shadow-[0_0_16px_rgba(192,132,252,0.6)]"
          />
          {/* Inner core */}
          <motion.div
            style={reducedMotion ? {} : { opacity: nodeGlow }}
            className="absolute h-2.5 w-2.5 rounded-full bg-[#FF9900] shadow-[0_0_10px_#FF9900]"
          />
        </motion.div>
      </div>

      {/* Spacer for desktop 2-column alternating alignment */}
      <div className="hidden md:block md:w-1/2" />

      {/* Milestone Card */}
      <div className="ml-10 sm:ml-12 md:ml-0 md:w-1/2 md:px-10">
        <motion.div
          style={
            reducedMotion
              ? { borderTop: '2px solid rgba(192, 132, 252, 0.4)' }
              : { opacity, y, borderTop: '2px solid rgba(192, 132, 252, 0.4)' }
          }
          className="relative z-10 rounded-2xl border border-white/[0.08] bg-[#120B1C] p-6 sm:p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.36)] transition-all hover:border-purple-400/30 text-left"
        >
          {/* Date Anchor */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] sm:text-[13px] font-mono font-bold uppercase tracking-[0.2em] text-[#C084FC]">
              {item.date}
            </span>
          </div>

          {/* Milestone Title */}
          <h3 className="font-serif text-[20px] sm:text-[24px] font-bold text-white tracking-[-0.01em]">
            {item.title}
          </h3>

          {/* Milestone Description */}
          <p className="mt-2.5 text-[14px] sm:text-[14.5px] leading-relaxed text-white/70 font-normal">
            {item.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const WomenInTechPage = () => {
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 75%'],
  });

  const smoothTimelineProgress = useSpring(timelineProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const pulseY = useTransform(smoothTimelineProgress, [0, 1], ['0%', '100%']);
  const todayNodeScale = useTransform(smoothTimelineProgress, [0.75, 0.9, 1], [0.85, 1.25, 1]);
  const todayNodeGlow = useTransform(smoothTimelineProgress, [0.75, 0.9, 1], [0.35, 1, 0.85]);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinModalRole, setJoinModalRole] = useState<ApplicationRole | undefined>();

  const featuredVoice = voices[activeVoiceIndex] || voices[0];

  useEffect(() => {
    fetch('/her-tech-era-photos/manifest.json')
      .then((res) => res.json())
      .then((images: string[]) => setGalleryImages(images))
      .catch(() => setGalleryImages([]));
  }, []);

  const displayImages = galleryImages.length > 0 ? galleryImages : defaultGalleryImages;
  const featuredPhoto = displayImages[0];
  const sidePhotos = displayImages.slice(1, 3);
  const bottomPhotos = displayImages.slice(3, 6);
  const extraPhotos = displayImages.slice(6);

  const openJoinModal = (role?: ApplicationRole) => {
    setJoinModalRole(role);
    setJoinModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Her Tech Era — AWS User Group Pune | Scaling Heights, Building Dreams</title>
        <meta name="description" content="Empowering women in cloud computing through mentorship, workshops, and community. It's Her Tech Era at AWS User Group Pune." />
      </Helmet>

      <motion.div className="min-h-screen bg-[#0A0A0A]" variants={reducedMotion ? {} : pageTransition} initial="initial" animate="animate" exit="exit">
        <Header />

        {/* ═══ HERO — Unified Emblem Event Hero ═══ */}
        <section className="relative flex min-h-[calc(100svh-44px)] flex-col justify-center items-center overflow-hidden pt-16 sm:pt-18 pb-6 sm:pb-8 text-center">
          {/* Deep atmospheric violet-to-midnight gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 95% 75% at 50% 15%, #270F42 0%, #150824 45%, #0D0517 78%, #0A0A0A 100%)',
            }}
          />

          {/* Soft ambient radial glow centered behind the emblem */}
          <div
            className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] sm:h-[540px] sm:w-[540px] lg:h-[640px] lg:w-[640px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(192, 132, 252, 0.18) 0%, rgba(147, 51, 234, 0.09) 40%, transparent 75%)',
              filter: 'blur(35px)',
            }}
            aria-hidden="true"
          />

          {/* Subtle translucent geometric accents for depth */}
          <div
            className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-[36px] border border-purple-400/[0.07] bg-gradient-to-br from-purple-500/[0.04] to-transparent rotate-12 blur-[1px] transform-gpu"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-1/4 -left-16 h-60 w-60 rounded-full border border-violet-300/[0.05] bg-radial from-violet-600/[0.03] to-transparent blur-[2px] transform-gpu"
            aria-hidden="true"
          />

          {/* Subtle technical grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 25h50M25 0v50'/%3E%3Ccircle cx='25' cy='25' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Tech network constellation trails radiating around the emblem */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="net-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="net-grad-right" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#F472B6" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Left wing connection trails */}
            <path
              d="M 400 330 Q 260 250 180 300 T 80 380"
              fill="none"
              stroke="url(#net-grad-left)"
              strokeWidth="0.75"
              strokeDasharray="4 4"
            />
            <path
              d="M 420 370 Q 300 410 200 360"
              fill="none"
              stroke="url(#net-grad-left)"
              strokeWidth="0.75"
            />

            {/* Right wing connection trails */}
            <path
              d="M 800 330 Q 940 250 1020 300 T 1120 380"
              fill="none"
              stroke="url(#net-grad-right)"
              strokeWidth="0.75"
              strokeDasharray="4 4"
            />
            <path
              d="M 780 370 Q 900 410 1000 360"
              fill="none"
              stroke="url(#net-grad-right)"
              strokeWidth="0.75"
            />

            {/* Network nodes */}
            <circle cx="180" cy="300" r="2.5" fill="#E9D5FF" />
            <circle cx="180" cy="300" r="6" fill="none" stroke="#C084FC" strokeWidth="0.5" opacity="0.5" />
            <circle cx="200" cy="360" r="2" fill="#FF9900" />
            <circle cx="80" cy="380" r="2" fill="#E9D5FF" />

            <circle cx="1020" cy="300" r="2.5" fill="#E9D5FF" />
            <circle cx="1020" cy="300" r="6" fill="none" stroke="#C084FC" strokeWidth="0.5" opacity="0.5" />
            <circle cx="1000" cy="360" r="2" fill="#38BDF8" />
            <circle cx="1120" cy="380" r="2" fill="#E9D5FF" />
          </svg>

          {/* Floating glowing particle embers */}
          {heroParticles.slice(0, 8).map((pt, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute rounded-full bg-[#E9D5FF]"
              style={{
                top: pt.top,
                left: pt.left,
                width: Math.min(pt.size, 3),
                height: Math.min(pt.size, 3),
                boxShadow: '0 0 8px rgba(233, 213, 255, 0.7)',
              }}
              animate={
                reducedMotion
                  ? {}
                  : {
                      y: [0, -12, 0],
                      opacity: [0.2, 0.55, 0.2],
                    }
              }
              transition={{
                duration: pt.duration,
                repeat: Infinity,
                delay: pt.delay,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            />
          ))}

          {/* Bottom fade into section background */}
          <div
            className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, #0A0A0A)',
            }}
          />

          <div className="site-container relative z-10 text-center mx-auto px-6 max-w-4xl">
            {/* Event Identity Eyebrow */}
            <motion.div
              className="mb-2 sm:mb-2.5 inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-purple-950/50 px-3.5 sm:px-4 py-1 backdrop-blur-md shadow-[0_0_16px_rgba(168,85,247,0.15)]"
              initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF9900] shadow-[0_0_6px_#FF9900] animate-pulse" />
              <span className="text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.18em] text-[#E9D5FF] uppercase">
                A Women in Technology Initiative by AWS User Group Pune
              </span>
            </motion.div>

            {/* ── UNIFIED HERO EMBLEM: WINGS FRAMING HER TECH ERA TITLE ── */}
            <motion.div
              className="relative mx-auto flex items-center justify-center gap-1 sm:gap-3 md:gap-5 lg:gap-6 my-1 max-w-5xl"
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Left Wing — Framing the left side of the title */}
              <motion.img
                src="/wings/right_wing.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none w-[90px] sm:w-[150px] md:w-[210px] lg:w-[260px] xl:w-[290px] shrink-0 opacity-95"
                style={{
                  filter:
                    'brightness(1.18) drop-shadow(0 0 20px rgba(216,180,254,0.38)) drop-shadow(0 0 50px rgba(147,51,234,0.2))',
                }}
                initial={reducedMotion ? {} : { x: -60, opacity: 0 }}
                animate={
                  reducedMotion
                    ? { x: 0, opacity: 0.95 }
                    : { x: 0, opacity: 0.95, y: [0, -6, 0] }
                }
                transition={
                  reducedMotion
                    ? { duration: 0.8 }
                    : {
                        x: { duration: 0.8, delay: 0.1, ease: 'easeOut' },
                        opacity: { duration: 0.8, delay: 0.1 },
                        y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                      }
                }
              />

              {/* Title — Clear, crisp foreground in DM Serif Display */}
              <h1
                className="font-serif text-[clamp(40px,6.2vw,76px)] font-bold leading-[0.9] tracking-[-0.015em] text-white shrink-0 text-center select-none relative z-20"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  textShadow:
                    '0 0 28px rgba(233, 213, 255, 0.45), 0 0 60px rgba(168, 85, 247, 0.25)',
                }}
              >
                HER<br />TECH<br />ERA
              </h1>

              {/* Right Wing — Framing the right side of the title */}
              <motion.img
                src="/wings/left_wing.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none w-[90px] sm:w-[150px] md:w-[210px] lg:w-[260px] xl:w-[290px] shrink-0 opacity-95"
                style={{
                  filter:
                    'brightness(1.18) drop-shadow(0 0 20px rgba(216,180,254,0.38)) drop-shadow(0 0 50px rgba(147,51,234,0.2))',
                }}
                initial={reducedMotion ? {} : { x: 60, opacity: 0 }}
                animate={
                  reducedMotion
                    ? { x: 0, opacity: 0.95 }
                    : { x: 0, opacity: 0.95, y: [0, -6, 0] }
                }
                transition={
                  reducedMotion
                    ? { duration: 0.8 }
                    : {
                        x: { duration: 0.8, delay: 0.1, ease: 'easeOut' },
                        opacity: { duration: 0.8, delay: 0.1 },
                        y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 },
                      }
                }
              />
            </motion.div>

            {/* Tagline — directly below emblem */}
            <motion.p
              className="mt-2 text-[clamp(19px,2.4vw,28px)] text-[#F3E8FF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Scaling Heights. Building Dreams.
            </motion.p>

            {/* Concise Description */}
            <motion.p
              className="mx-auto mt-1 sm:mt-1.5 max-w-[500px] text-[13px] sm:text-[14px] leading-relaxed text-white/75 font-normal"
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Empowering women in cloud, AI, DevOps, and architecture through mentorship, workshops, and community.
            </motion.p>

            {/* Event Information Row */}
            <motion.div
              className="mt-2.5 sm:mt-3 inline-flex items-center gap-2 sm:gap-2.5 text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.22em] text-white uppercase"
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Calendar className="h-3 w-3 text-[#FF9900]" />
              <span className="text-white">18 OCTOBER 2026</span>
              <span className="text-white/30 text-xs">·</span>
              <MapPin className="h-3 w-3 text-purple-300" />
              <span className="text-[#E9D5FF]">PUNE</span>
            </motion.div>

            {/* Primary & Secondary CTAs */}
            <motion.div
              className="mt-3.5 sm:mt-4 flex flex-wrap justify-center items-center gap-3"
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                size="default"
                className="h-10 sm:h-10.5 rounded-full bg-white px-7 text-[13.5px] font-bold text-[#2B0E44] shadow-[0_0_24px_rgba(255,255,255,0.4)] hover:bg-[#F3E8FF] hover:shadow-[0_0_36px_rgba(233,213,255,0.65)] hover:scale-[1.02] transition-all cursor-pointer"
                onClick={() => openJoinModal()}
              >
                JOIN HER TECH ERA →
              </Button>
              <Button
                asChild
                size="default"
                className="h-10 sm:h-10.5 rounded-full border border-white/20 bg-white/[0.04] px-5 text-[13px] font-semibold text-white/90 backdrop-blur-sm hover:border-white/50 hover:bg-white/10 hover:text-white hover:scale-[1.02] transition-all"
              >
                <a
                  href="https://www.linkedin.com/company/aws-ug-for-women-in-tech-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow on LinkedIn <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══ IMPACT & STATISTICS (Moved from Hero) ═══ */}
        <section className="relative z-10 pt-4 pb-16 px-6">
          <div className="site-container max-w-5xl mx-auto">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {heroStats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  whileHover={
                    reducedMotion
                      ? {}
                      : {
                          y: -3,
                          borderColor: 'rgba(192, 132, 252, 0.5)',
                          boxShadow: '0 8px 24px rgba(109, 100, 173, 0.18)',
                        }
                  }
                  className="rounded-2xl border border-white/10 bg-[#120B1C]/85 p-4 sm:p-5 text-center backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.36)] transition-all"
                  style={{ borderTop: '2px solid #9361A1' }}
                >
                  <div className="text-[26px] sm:text-[30px] font-black tracking-tight text-white">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[12.5px] sm:text-[13.5px] font-semibold text-white/90">
                    {s.label}
                  </div>
                  <div className="mt-1 text-[11px] sm:text-[11.5px] text-white/50 leading-snug">
                    {s.detail}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ WHAT WE STAND FOR — Editorial 2x2 Pillars ═══ */}
        <section className="py-20 sm:py-28 bg-[#09050E] relative border-t border-b border-white/[0.06]">
          <div className="site-container max-w-6xl mx-auto px-6 sm:px-8">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-12 border-b border-white/[0.08]">
              <div>
                <motion.span
                  className="text-[11px] sm:text-[12px] font-bold tracking-[0.22em] text-[#C084FC] uppercase block mb-2"
                  initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                >
                  WHAT WE STAND FOR
                </motion.span>
                <motion.h2
                  className="font-serif text-[clamp(30px,4vw,48px)] font-bold tracking-[-0.02em] text-white leading-[1.05]"
                  initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                >
                  Four ideas.<br className="hidden sm:inline" /> One shared direction.
                </motion.h2>
              </div>
              <motion.p
                className="max-w-md text-[14px] sm:text-[15px] text-white/70 leading-relaxed font-normal"
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: 0.15 }}
              >
                A continuous progression from first exploration to technical stage presence — built with practical skills, compounding relationships, and real representation.
              </motion.p>
            </div>

            {/* Subtle Journey Connection Ribbon */}
            <div className="hidden sm:flex items-center justify-between text-[11px] font-mono tracking-widest text-white/40 py-4 px-2 border-b border-white/[0.05]">
              <span className="flex items-center gap-2 text-white/70 font-semibold"><span className="text-[#C084FC]">01</span> LEARN</span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-2 text-white/70 font-semibold"><span className="text-[#C084FC]">02</span> BE SEEN</span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-2 text-white/70 font-semibold"><span className="text-[#C084FC]">03</span> CONNECT</span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-2 text-white/70 font-semibold"><span className="text-[#C084FC]">04</span> GROW</span>
            </div>

            {/* 2x2 Editorial Grid with Subtle Hairline Dividers */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              {/* Column 1 (01 Learn & 03 Connect) */}
              <div className="divide-y divide-white/[0.08]">
                {/* 01 — LEARN */}
                <motion.article
                  className="group p-8 sm:p-10 lg:p-12 transition-colors hover:bg-white/[0.015]"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[36px] sm:text-[44px] font-light text-white/20 group-hover:text-[#C084FC]/60 transition-colors">
                      {pillars[0].num}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-white/35 uppercase">
                      {pillars[0].phase}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <span className="text-[11px] sm:text-[11.5px] font-black tracking-[0.2em] text-[#D8B4FE] uppercase block mb-1">
                      {pillars[0].action}
                    </span>
                    <h3 className="font-serif text-[21px] sm:text-[24px] font-bold text-white tracking-[-0.01em]">
                      {pillars[0].subtitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-[14px] sm:text-[14.5px] leading-[1.75] text-white/70 font-normal max-w-md">
                    {pillars[0].description}
                  </p>
                </motion.article>

                {/* 03 — CONNECT */}
                <motion.article
                  className="group p-8 sm:p-10 lg:p-12 transition-colors hover:bg-white/[0.015]"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[36px] sm:text-[44px] font-light text-white/20 group-hover:text-[#C084FC]/60 transition-colors">
                      {pillars[2].num}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-white/35 uppercase">
                      {pillars[2].phase}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <span className="text-[11px] sm:text-[11.5px] font-black tracking-[0.2em] text-[#D8B4FE] uppercase block mb-1">
                      {pillars[2].action}
                    </span>
                    <h3 className="font-serif text-[21px] sm:text-[24px] font-bold text-white tracking-[-0.01em]">
                      {pillars[2].subtitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-[14px] sm:text-[14.5px] leading-[1.75] text-white/70 font-normal max-w-md">
                    {pillars[2].description}
                  </p>
                </motion.article>
              </div>

              {/* Column 2 (02 Be Seen & 04 Grow) */}
              <div className="divide-y divide-white/[0.08]">
                {/* 02 — BE SEEN */}
                <motion.article
                  className="group p-8 sm:p-10 lg:p-12 transition-colors hover:bg-white/[0.015]"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[36px] sm:text-[44px] font-light text-white/20 group-hover:text-[#C084FC]/60 transition-colors">
                      {pillars[1].num}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-white/35 uppercase">
                      {pillars[1].phase}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <span className="text-[11px] sm:text-[11.5px] font-black tracking-[0.2em] text-[#D8B4FE] uppercase block mb-1">
                      {pillars[1].action}
                    </span>
                    <h3 className="font-serif text-[21px] sm:text-[24px] font-bold text-white tracking-[-0.01em]">
                      {pillars[1].subtitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-[14px] sm:text-[14.5px] leading-[1.75] text-white/70 font-normal max-w-md">
                    {pillars[1].description}
                  </p>
                </motion.article>

                {/* 04 — GROW */}
                <motion.article
                  className="group p-8 sm:p-10 lg:p-12 transition-colors hover:bg-white/[0.015]"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[36px] sm:text-[44px] font-light text-white/20 group-hover:text-[#C084FC]/60 transition-colors">
                      {pillars[3].num}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-white/35 uppercase">
                      {pillars[3].phase}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <span className="text-[11px] sm:text-[11.5px] font-black tracking-[0.2em] text-[#D8B4FE] uppercase block mb-1">
                      {pillars[3].action}
                    </span>
                    <h3 className="font-serif text-[21px] sm:text-[24px] font-bold text-white tracking-[-0.01em]">
                      {pillars[3].subtitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-[14px] sm:text-[14.5px] leading-[1.75] text-white/70 font-normal max-w-md">
                    {pillars[3].description}
                  </p>
                </motion.article>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ EDITORIAL PHOTOGRAPHY: HER TECH ERA IN ACTION ═══ */}
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-24 bg-[#0c0812] relative overflow-hidden">
          <div className="site-container max-w-7xl mx-auto px-6 sm:px-8">
            {/* Viewport-Efficient Editorial Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-white/[0.08]">
              <div>
                <motion.span
                  className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] text-[#C084FC] uppercase block mb-1.5"
                  initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                >
                  Documentary &amp; Archive
                </motion.span>
                <motion.h2
                  className="font-serif text-[clamp(28px,3.8vw,46px)] font-bold tracking-[-0.02em] text-white leading-[0.98]"
                  initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                >
                  HER TECH ERA<br />
                  <span className="text-white/60 font-serif">IN ACTION.</span>
                </motion.h2>
              </div>
              <motion.p
                className="max-w-md text-[13.5px] sm:text-[14.5px] text-white/70 leading-relaxed font-normal"
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: 0.15 }}
              >
                The real people, live moments, and compounding energy behind the movement — captured on stage, in deep-dive workshops, and across rooms in Pune.
              </motion.p>
            </div>

            {/* ROW 1: Structured 2-Row CSS Grid — Cohesive Flush Block */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 gap-4 sm:gap-5 lg:h-[420px] xl:h-[450px] items-stretch">
              {/* Left: FEATURED IMAGE (Spans 7 cols, spans 2 full rows) */}
              {featuredPhoto && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-30px' }}
                  className="group relative sm:col-span-2 lg:col-span-7 lg:row-span-2 rounded-xl sm:rounded-2xl overflow-hidden bg-[#150F1E] border border-white/[0.06] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto h-full w-full"
                >
                  <img
                    src={`/her-tech-era-photos/${featuredPhoto}`}
                    alt="Her Tech Era featured community moment"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-65 group-hover:opacity-85 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.18em] text-white/95 uppercase drop-shadow-md">
                      COMMUNITY DAY · PUNE
                    </span>
                    <span className="text-[10.5px] font-semibold text-white/60 tracking-wider uppercase">
                      Featured
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Right Top: PHOTO 2 (Spans 5 cols, row 1) */}
              {sidePhotos[0] && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-30px' }}
                  className="group relative sm:col-span-1 lg:col-span-5 lg:row-span-1 rounded-xl sm:rounded-2xl overflow-hidden bg-[#150F1E] border border-white/[0.06] aspect-[16/10] lg:aspect-auto h-full w-full"
                >
                  <img
                    src={`/her-tech-era-photos/${sidePhotos[0]}`}
                    alt="Her Tech Era community moment 2"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
                      COMMUNITY DAY · PUNE
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Right Bottom: PHOTO 3 (Spans 5 cols, row 2) */}
              {sidePhotos[1] && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-30px' }}
                  className="group relative sm:col-span-1 lg:col-span-5 lg:row-span-1 rounded-xl sm:rounded-2xl overflow-hidden bg-[#150F1E] border border-white/[0.06] aspect-[16/10] lg:aspect-auto h-full w-full"
                >
                  <img
                    src={`/her-tech-era-photos/${sidePhotos[1]}`}
                    alt="Her Tech Era community moment 3"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
                      COMMUNITY DAY · PUNE
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ROW 2: Three evenly sized supporting images spanning the full gallery width */}
            <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {bottomPhotos.map((src, idx) => (
                <motion.div
                  key={src}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-30px' }}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#150F1E] border border-white/[0.06] aspect-[16/10] h-full w-full"
                >
                  <img
                    src={`/her-tech-era-photos/${src}`}
                    alt={`Her Tech Era community moment ${idx + 4}`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <span className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
                      COMMUNITY DAY · PUNE
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Expandable Extra Archive Photos */}
            {extraPhotos.length > 0 && showAllPhotos && (
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
              >
                {extraPhotos.map((src, idx) => (
                  <div
                    key={src}
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#150F1E] border border-white/[0.06] aspect-[16/10]"
                  >
                    <img
                      src={`/her-tech-era-photos/${src}`}
                      alt={`Her Tech Era archive moment ${idx + 1}`}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5">
                      <span className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.16em] text-white/90 uppercase drop-shadow-md">
                        COMMUNITY DAY · PUNE
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Archive Toggle Button */}
            {extraPhotos.length > 0 && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/70 hover:text-white transition-colors cursor-pointer py-1.5 px-4 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03]"
                >
                  {showAllPhotos ? 'Show Curated Selection' : `View Full Photo Archive (${displayImages.length})`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ═══ IMMERSIVE SCROLL-DRIVEN JOURNEY TIMELINE ═══ */}
        <section ref={timelineRef} className="py-24 sm:py-32 bg-[#09050E] relative overflow-hidden border-t border-b border-white/[0.06]">
          <div className="site-container max-w-5xl mx-auto px-6 sm:px-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
              <motion.div
                className="text-[11px] sm:text-[12px] font-bold tracking-[0.22em] text-[#C084FC] uppercase mb-2 block"
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
              >
                Our Journey
              </motion.div>
              <motion.h2
                className="font-serif text-[clamp(32px,4vw,52px)] font-bold tracking-[-0.02em] text-white leading-[1.05]"
                initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                From first panel to full initiative
              </motion.h2>
              <motion.p
                className="mt-3.5 text-[14.5px] sm:text-[15.5px] text-white/70 leading-relaxed font-normal"
                initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.16 }}
              >
                An intentional evolution from a single panel into a continuous community ecosystem across cloud, AI, and DevOps.
              </motion.p>
            </div>

            {/* Central Timeline Spine Container */}
            <div className="relative">
              {/* Background Track Line */}
              <div className="absolute left-4 md:left-1/2 top-4 bottom-14 w-[2px] -translate-x-1/2 bg-white/[0.08] pointer-events-none z-0" />

              {/* Scroll-Linked Glowing Active Spine */}
              <motion.div
                style={
                  reducedMotion
                    ? { scaleY: 1 }
                    : { scaleY: smoothTimelineProgress, transformOrigin: 'top' }
                }
                className="absolute left-4 md:left-1/2 top-4 bottom-14 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#C084FC] via-[#9333EA] to-[#FF9900] shadow-[0_0_12px_rgba(192,132,252,0.8),0_0_24px_rgba(255,153,0,0.4)] pointer-events-none z-0"
              />

              {/* Luminous Data Packet traveling with scroll head */}
              {!reducedMotion && (
                <motion.div
                  style={{ top: pulseY }}
                  className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_#C084FC,0_0_24px_#FF9900] z-[1] pointer-events-none"
                />
              )}

              {/* Milestones */}
              {timeline.map((item, index) => (
                <TimelineMilestone
                  key={item.date}
                  item={item}
                  index={index}
                  total={timeline.length}
                  scrollYProgress={smoothTimelineProgress}
                  reducedMotion={reducedMotion}
                />
              ))}

              {/* Culminating Endpoint: TODAY / WHERE WE ARE NOW */}
              <div className="relative pt-14 md:pt-20 pb-6">
                {/* Glowing Milestone Node positioned in the open vertical space above the destination block */}
                <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
                  <motion.div
                    style={reducedMotion ? {} : { scale: todayNodeScale }}
                    className="relative flex items-center justify-center"
                  >
                    {/* Outer ambient glow halo */}
                    <motion.div
                      style={reducedMotion ? {} : { opacity: todayNodeGlow }}
                      className="h-11 w-11 rounded-full border border-[#FF9900]/60 bg-[#160924] flex items-center justify-center shadow-[0_0_28px_rgba(255,153,0,0.55),0_0_12px_rgba(192,132,252,0.4)]"
                    >
                      {/* Concentric purple ring */}
                      <div className="h-6 w-6 rounded-full border border-purple-400/50 bg-[#1F0D33] flex items-center justify-center">
                        {/* Radiant pulsing amber core */}
                        <div className="h-3 w-3 rounded-full bg-[#FF9900] shadow-[0_0_12px_#FF9900] animate-pulse" />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Destination Content Layer — Opaque dark surface completely hiding the infrastructure spine behind text */}
                <div className="ml-10 sm:ml-12 md:ml-0">
                  <motion.div
                    className="relative z-10 mx-auto max-w-2xl rounded-2xl sm:rounded-3xl border border-purple-400/25 bg-[#0D0718] p-7 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(192,132,252,0.12)] text-left md:text-center overflow-hidden"
                    style={{
                      borderTop: '2px solid #FF9900',
                    }}
                    initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.55 }}
                  >
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-950/80 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-[11.5px] font-mono font-bold tracking-[0.2em] text-[#E9D5FF] uppercase mb-4 shadow-inner">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF9900] shadow-[0_0_6px_#FF9900]" />
                      WHERE WE ARE NOW · TODAY
                    </div>

                    {/* Destination Headline */}
                    <h3 className="font-serif text-[22px] sm:text-[26px] md:text-[30px] font-bold text-white tracking-[-0.015em] leading-[1.25] max-w-lg md:mx-auto">
                      A continuous, compounding community of women in technology.
                    </h3>

                    {/* Description */}
                    <p className="mt-3.5 text-[13.5px] sm:text-[14.5px] md:text-[15px] text-white/75 max-w-md md:mx-auto leading-relaxed font-normal">
                      From our first panel to regular technical tracks, workshops, and flagship Community Days — building confidence, visibility, and leadership year-round.
                    </p>
                  </motion.div>
                </div>

                {/* Resumed Line Termination — Infrastructure Hub below content */}
                <div className="relative z-10 flex flex-col items-center pt-10 md:pt-14 pb-2 pointer-events-none">
                  <div className="h-4 w-4 rounded-full border border-[#FF9900]/70 bg-[#09050E] flex items-center justify-center shadow-[0_0_14px_rgba(255,153,0,0.7)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF9900]" />
                  </div>
                  <span className="mt-2.5 text-[10px] font-mono font-bold tracking-[0.25em] text-white/40 uppercase">
                    CONTINUOUS INITIATIVE · YEAR-ROUND
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ EDITORIAL TESTIMONIALS: COMMUNITY VOICES ═══ */}
        <section className="py-20 sm:py-24 bg-[#0a0710] relative overflow-hidden border-t border-b border-white/[0.06]">
          {/* Subtle atmospheric violet glow */}
          <div
            className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.05) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          <div className="site-container max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
            {/* Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 sm:pb-10 border-b border-white/[0.08]">
              <div>
                <motion.span
                  className="text-[11px] font-mono font-bold tracking-[0.22em] text-[#C084FC] uppercase block mb-1.5"
                  initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                >
                  COMMUNITY VOICES
                </motion.span>
                <motion.h2
                  className="font-serif text-[clamp(28px,3.6vw,42px)] font-bold tracking-[-0.02em] text-white leading-[1.05]"
                  initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: 0.06 }}
                >
                  Real conversations, shared journeys
                </motion.h2>
              </div>

              {/* Subtle manual 01 / 02 / 03 / 04 navigation */}
              <div className="flex items-center gap-1.5 font-mono text-[12px] shrink-0">
                <span className="text-[10.5px] font-mono tracking-widest text-white/30 uppercase mr-1.5 hidden sm:inline">
                  VOICE
                </span>
                {voices.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVoiceIndex(idx)}
                    className={`h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      idx === activeVoiceIndex
                        ? 'bg-purple-950/80 text-[#FF9900] font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(192,132,252,0.2)]'
                        : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    aria-label={`Select voice 0${idx + 1}`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Asymmetric Editorial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 sm:pt-10 items-stretch">
              {/* Featured Voice (Left 7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between relative pr-0 lg:pr-6">
                {/* Large subtle quotation mark watermark as background detail */}
                <span
                  className="absolute -top-6 -left-3 font-serif text-[110px] sm:text-[130px] leading-none text-purple-300/[0.06] select-none pointer-events-none"
                  aria-hidden="true"
                >
                  “
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeVoiceIndex}
                    initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? {} : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="relative z-10 flex flex-col justify-between h-full"
                  >
                    {/* Large elegant serif/italic quote, around 28–36px */}
                    <blockquote className="min-h-[140px] sm:min-h-[160px] flex items-center">
                      <p className="font-serif italic text-[clamp(22px,2.4vw,32px)] leading-[1.4] text-[#F3E8FF] tracking-[-0.01em]">
                        "{featuredVoice.quote}"
                      </p>
                    </blockquote>

                    {/* Prominent 56–72px portrait with clear name and role underneath */}
                    <div className="mt-8 sm:mt-10 pt-6 border-t border-white/[0.06] flex items-center gap-4 sm:gap-5">
                      <img
                        src={featuredVoice.image}
                        alt={featuredVoice.name}
                        className="h-16 w-16 sm:h-18 sm:w-18 rounded-full object-cover ring-2 ring-purple-400/30 shadow-[0_0_24px_rgba(192,132,252,0.2)] shrink-0"
                        loading="lazy"
                      />
                      <div>
                        <h3 className="text-[17px] sm:text-[19px] font-semibold text-white tracking-tight">
                          {featuredVoice.name}
                        </h3>
                        <p className="text-[11.5px] sm:text-[12px] font-mono font-medium tracking-[0.16em] text-[#C084FC] uppercase mt-0.5">
                          {featuredVoice.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Supporting Voices (Right 5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0 lg:pl-8">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/35 uppercase mb-3 px-3 block">
                  COMMUNITY VOICES · 04 VOICES
                </span>
                <div className="divide-y divide-white/[0.07]">
                  {voices.map((v, idx) => {
                    const isActive = idx === activeVoiceIndex;
                    return (
                      <button
                        key={v.name}
                        onClick={() => setActiveVoiceIndex(idx)}
                        className={`w-full text-left py-3.5 sm:py-4 px-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                          isActive
                            ? 'bg-purple-950/30 border-l-2 border-[#FF9900] pl-3'
                            : 'hover:bg-white/[0.02] border-l-2 border-transparent opacity-65 hover:opacity-100'
                        }`}
                        aria-label={`Show testimonial from ${v.name}`}
                      >
                        <span className={`font-mono text-[11px] font-bold tracking-widest shrink-0 ${
                          isActive ? 'text-[#FF9900]' : 'text-white/35'
                        }`}>
                          0{idx + 1}
                        </span>
                        <img
                          src={v.image}
                          alt={v.name}
                          className={`h-10 w-10 rounded-full object-cover shrink-0 transition-all ${
                            isActive ? 'ring-2 ring-[#FF9900]/80 shadow-[0_0_10px_rgba(255,153,0,0.3)]' : 'ring-1 ring-white/15'
                          }`}
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className={`text-[14px] font-semibold truncate transition-colors ${
                              isActive ? 'text-white' : 'text-white/80'
                            }`}>
                              {v.name}
                            </h4>
                            <span className="text-[10px] font-mono tracking-wider text-[#C084FC]/80 uppercase shrink-0">
                              {v.role.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-[12.5px] text-white/55 line-clamp-1 italic font-serif mt-0.5">
                            "{v.quote}"
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ OUR PHILOSOPHY: VALUES ═══ */}
        <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 bg-[#09050E] relative overflow-hidden">
          <div className="site-container max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <motion.span
                className="text-[11px] font-mono font-bold tracking-[0.22em] text-[#C084FC] uppercase block mb-1.5"
                initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
              >
                OUR PHILOSOPHY
              </motion.span>
              <motion.h2
                className="font-serif text-[clamp(28px,3.8vw,44px)] font-bold tracking-[-0.02em] text-white leading-[1.05]"
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: 0.06 }}
              >
                What drives this initiative
              </motion.h2>
            </div>

            {/* 4-Step Progression Grid */}
            <div className="relative">
              {/* Continuous connecting purple hairline track across the top on desktop */}
              <div className="hidden lg:block absolute top-[21px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-purple-400/20 via-purple-400/40 to-[#FF9900]/30 z-0 pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 relative z-10">
                {values.map((val, idx) => (
                  <motion.div
                    key={val.step}
                    className="group relative flex flex-col justify-between"
                    initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                  >
                    <div>
                      {/* Progression Node Anchor */}
                      <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <div className="relative flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full border border-purple-400/40 bg-[#09050E] flex items-center justify-center shadow-[0_0_12px_rgba(192,132,252,0.4)] transition-all group-hover:border-[#FF9900]/60">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#C084FC] group-hover:bg-[#FF9900] transition-colors" />
                          </div>
                        </div>
                        <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#C084FC] uppercase">
                          PHASE 0{idx + 1}
                        </span>
                      </div>

                      {/* Large Number Anchor */}
                      <span className="font-mono text-[36px] sm:text-[42px] font-light text-white/20 group-hover:text-[#C084FC]/70 transition-colors block leading-none mb-3">
                        {val.step}
                      </span>

                      {/* Action Title */}
                      <h3 className="font-mono text-[13px] sm:text-[14px] font-bold tracking-[0.18em] text-white uppercase mb-2.5">
                        {val.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[13.5px] sm:text-[14px] leading-[1.75] text-white/65 font-normal">
                        {val.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TRANSITION CONNECTOR ═══ */}
        <div className="bg-[#09050E] flex flex-col items-center justify-center py-2 sm:py-4 pointer-events-none">
          <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-purple-400/35 via-purple-400/15 to-transparent" />
        </div>

        {/* ═══ CINEMATIC FINAL CTA: THE CLOSING CHAPTER ═══ */}
        <section className="pt-6 sm:pt-8 pb-24 sm:pb-32 bg-[#09050E] relative overflow-hidden text-center">
          {/* Subtle atmospheric violet glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] sm:h-[700px] sm:w-[700px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(192, 132, 252, 0.04) 40%, transparent 70%)',
              filter: 'blur(55px)',
            }}
          />

          {/* Subtle references to earlier wings visual language */}
          <img
            src="/wings/left_wing.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-[2%] sm:left-[6%] lg:left-[10%] top-1/2 -translate-y-1/2 h-56 sm:h-72 w-auto opacity-[0.05] select-none filter blur-[0.5px]"
          />
          <img
            src="/wings/right_wing.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[2%] sm:right-[6%] lg:right-[10%] top-1/2 -translate-y-1/2 h-56 sm:h-72 w-auto opacity-[0.05] select-none filter blur-[0.5px]"
          />

          <div className="site-container max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
            {/* Supporting Line */}
            <motion.div
              className="inline-flex items-center gap-2 font-mono text-[11.5px] sm:text-[13px] font-bold tracking-[0.28em] text-[#C084FC] uppercase mb-4"
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF9900]" />
              Learn · Build · Connect · Lead
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="font-serif text-[clamp(34px,5.5vw,66px)] font-bold tracking-[-0.025em] text-white leading-[1.0] max-w-3xl mx-auto"
              initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              YOUR ERA STARTS HERE.
            </motion.h2>

            {/* Concise Invitation */}
            <motion.p
              className="mt-4 sm:mt-5 mx-auto max-w-[560px] text-[15px] sm:text-[16px] leading-relaxed text-white/70 font-normal"
              initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              Whether you want to speak at a technical track, volunteer, or simply find your community — there is a seat waiting for you.
            </motion.p>

            {/* Actions */}
            <motion.div
              className="mt-8 sm:mt-10 flex flex-wrap justify-center items-center gap-3 sm:gap-4"
              initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              <Button
                size="lg"
                className="h-12 sm:h-13 rounded-full bg-white px-8 sm:px-9 text-[14px] sm:text-[14.5px] font-bold text-[#200B35] shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:bg-[#F3E8FF] hover:shadow-[0_0_40px_rgba(233,213,255,0.6)] hover:scale-[1.02] transition-all cursor-pointer"
                onClick={() => openJoinModal()}
              >
                JOIN THE COMMUNITY →
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 sm:h-13 rounded-full border border-white/20 bg-white/[0.04] px-6 sm:px-7 text-[13.5px] sm:text-[14px] font-semibold text-white/90 backdrop-blur-sm hover:border-white/50 hover:bg-white/10 hover:text-white hover:scale-[1.02] transition-all cursor-pointer"
                onClick={() => openJoinModal('speaker')}
              >
                <Mic2 className="mr-2 h-4 w-4 text-[#C084FC]" />
                Speak at a Session
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 sm:h-13 rounded-full border border-white/20 bg-white/[0.04] px-6 sm:px-7 text-[13.5px] sm:text-[14px] font-semibold text-white/90 backdrop-blur-sm hover:border-white/50 hover:bg-white/10 hover:text-white hover:scale-[1.02] transition-all cursor-pointer"
                onClick={() => openJoinModal('volunteer')}
              >
                <HandHeart className="mr-2 h-4 w-4 text-[#FF9900]" />
                Volunteer
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
        <BackToTop />
      </motion.div>

      {/* Join Form Modal */}
      <JoinFormModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        initialRole={joinModalRole}
      />
    </>
  );
};

export default WomenInTechPage;
