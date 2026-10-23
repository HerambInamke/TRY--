import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/** Thin reading-progress bar pinned to the top of every page. */
const ScrollProgress = () => {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  if (reducedMotion) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#C084FC] via-[#9333EA] to-[#FF9900] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
