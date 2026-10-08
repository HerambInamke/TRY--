import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CalendarDays, Zap } from 'lucide-react';
import { useAnnouncements } from '@/hooks/use-announcements';

const DISMISS_KEY = 'marquee-dismissed';

const EventMarquee = () => {
  const { announcements, loading } = useAnnouncements();
  const [dismissed, setDismissed] = useState(false);
  const [sequenceCount, setSequenceCount] = useState(2);
  const overflowRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, 'true');
  };

  const isVisible = !loading && announcements.length > 0 && !dismissed;

  useEffect(() => {
    document.documentElement.classList.toggle('has-event-marquee', isVisible);

    return () => {
      document.documentElement.classList.remove('has-event-marquee');
    };
  }, [isVisible]);

  useLayoutEffect(() => {
    if (!isVisible) return;

    const overflow = overflowRef.current;
    const sequence = sequenceRef.current;
    if (!overflow || !sequence) return;

    const updateSequenceCount = () => {
      const sequenceWidth = sequence.getBoundingClientRect().width;
      if (sequenceWidth === 0) return;

      setSequenceCount(Math.max(2, Math.ceil(overflow.clientWidth / sequenceWidth) + 1));
    };

    const observer = new ResizeObserver(updateSequenceCount);
    observer.observe(overflow);
    observer.observe(sequence);
    updateSequenceCount();

    return () => observer.disconnect();
  }, [announcements, isVisible]);

  if (!isVisible) return null;

  const renderItems = (groupKey: string, isDuplicate: boolean) =>
    announcements.map((a, idx) => {
      const targetUrl = a.link || a.meetupLink;
      const isLuma = a.platform === 'luma' || /lu\.ma|luma/i.test(targetUrl);
      const isMeetup = a.platform === 'meetup' || /meetup\.com/i.test(targetUrl);
      const platformName = isLuma ? 'Luma' : isMeetup ? 'Meetup' : 'Event';
      const isUpcoming = a.badge ? a.badge === 'UPCOMING' : !/latest|recap|past/i.test(a.message);
      const badgeLabel = a.badge || (isUpcoming ? 'UPCOMING' : 'LATEST');

      return (
        <a
          key={`${groupKey}-${a.$id || idx}`}
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isDuplicate ? -1 : undefined}
          className="group marquee-item focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-300"
          aria-label={`${badgeLabel}: ${a.message} - Open on ${platformName}`}
          title={`Open event on ${platformName}`}
        >
          <span
            className={`marquee-status-badge ${
              isUpcoming ? 'marquee-status-upcoming' : 'marquee-status-latest'
            }`}
          >
            {badgeLabel}
          </span>

          {a.date && (
            <span className="marquee-item-date">
              <CalendarDays className="h-3 w-3 opacity-80" />
              <span>{a.date}</span>
            </span>
          )}

          <span className="marquee-item-text">{a.message}</span>

          <span className="marquee-platform-pill">
            <span>{platformName}</span>
            <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>

          <span className="marquee-item-separator" aria-hidden="true">✦</span>
        </a>
      );
    });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-40 overflow-hidden"
        id="event-marquee"
      >
        <div className="marquee-bar">
          {/* Animated background gradient */}
          <div className="marquee-bg" />

          {/* Shimmer sweep effect */}
          <div className="marquee-shimmer" />

          {/* Events badge on the left */}
          <div className="marquee-badge">
            <Zap className="marquee-badge-icon" />
            <span className="marquee-badge-text">EVENTS</span>
            <span className="marquee-badge-dot" />
          </div>

          {/* Marquee track */}
          <div className="marquee-overflow" ref={overflowRef}>
            <div className="marquee-track">
              <div className="marquee-group flex items-center">
                {Array.from({ length: sequenceCount }, (_, index) => (
                  <div
                    key={`primary-${index}`}
                    ref={index === 0 ? sequenceRef : undefined}
                    className="marquee-sequence flex items-center"
                    aria-hidden={index > 0 || undefined}
                  >
                    {renderItems(`primary-${index}`, index > 0)}
                  </div>
                ))}
              </div>
              <div className="marquee-group flex items-center" aria-hidden="true">
                {Array.from({ length: sequenceCount }, (_, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="marquee-sequence flex items-center"
                  >
                    {renderItems(`duplicate-${index}`, true)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fade edges */}
          <div className="marquee-fade-left" />
          <div className="marquee-fade-right" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="marquee-close"
            aria-label="Dismiss event announcement"
          >
            <X className="h-3 w-3" />
          </button>

          {/* Top edge glow */}
          <div className="marquee-edge-glow" />
          {/* Bottom edge glow */}
          <div className="marquee-edge-glow-bottom" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventMarquee;
