import { useMemo } from 'react';
import { useAnnouncements, type Announcement } from '@/hooks/use-announcements';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Reads the free-text date the team types in the CMS ("May 16, 2026", "Aug 2026", "2026-11-14").
 * Returns the last moment the event can still be "upcoming", or null when the text is not a date
 * ("Recent Recap", "Session Slides").
 */
export const parseEventDate = (text?: string): Date | null => {
  if (!text) return null;
  const t = text.trim();

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3], 23, 59);

  const dayFirst = /(\d{1,2})\s+([a-z]{3})[a-z]*\.?,?\s+(\d{4})/i.exec(t);
  if (dayFirst) {
    const m = MONTHS.indexOf(dayFirst[2].toLowerCase());
    if (m >= 0) return new Date(+dayFirst[3], m, +dayFirst[1], 23, 59);
  }

  const monthFirst = /([a-z]{3})[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i.exec(t);
  if (monthFirst) {
    const m = MONTHS.indexOf(monthFirst[1].toLowerCase());
    if (m >= 0) return new Date(+monthFirst[3], m, +monthFirst[2], 23, 59);
  }

  const monthOnly = /([a-z]{3})[a-z]*\.?\s+(\d{4})/i.exec(t);
  if (monthOnly) {
    const m = MONTHS.indexOf(monthOnly[1].toLowerCase());
    if (m >= 0) return new Date(+monthOnly[2], m + 1, 0, 23, 59); // last day of that month
  }

  return null;
};

/** The next announced event that has not happened yet, labelled by its own date, not by its badge. */
export const useNextEvent = (): (Announcement & { when: Date }) | null => {
  const { announcements } = useAnnouncements();
  return useMemo(() => {
    const now = new Date();
    const upcoming = announcements
      .map((a) => ({ ...a, when: parseEventDate(a.date) }))
      .filter((a): a is Announcement & { when: Date } => !!a.when && a.when >= now)
      .sort((a, b) => a.when.getTime() - b.when.getTime());
    return upcoming[0] ?? null;
  }, [announcements]);
};
