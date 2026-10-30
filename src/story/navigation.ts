import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollTo } from './smooth';

export type Chapter = { id: string; label: string; href?: string; newTab?: boolean };

export const chapters: Chapter[] = [
  { id: 'inside', label: 'Through the gate' },
  { id: 'numbers', label: 'The numbers' },
  { id: 'what-we-do', label: 'What we do' },
  { id: 'her-tech-era', label: 'Her Tech Era ↗', href: '/her-tech-era', newTab: true },
  { id: 'every-month', label: 'Every month' },
  { id: 'people', label: 'The crew' },
  { id: 'questions', label: 'Questions' },
  { id: 'join', label: 'Join us' },
];

/** Scrolls to a chapter on the home page, or goes home and lands on it. */
export const useGoToChapter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (id: string, home = '/') => {
      const el = document.getElementById(id);
      if (el) {
        smoothScrollTo(el);
        history.replaceState(null, '', `${pathname}#${id}`);
        return;
      }
      navigate(`${home}#${id}`);
    },
    [navigate, pathname],
  );
};
