/* Her Tech Era photo stickers (tone + shadow), baked from public/her-tech-era-photos. */
import g1Src from '@/assets/zine/hte-g1.webp';
import g1Shadow from '@/assets/zine/hte-g1-shadow.webp';
import g2Src from '@/assets/zine/hte-g2.webp';
import g2Shadow from '@/assets/zine/hte-g2-shadow.webp';
import g3Src from '@/assets/zine/hte-g3.webp';
import g3Shadow from '@/assets/zine/hte-g3-shadow.webp';
import g4Src from '@/assets/zine/hte-g4.webp';
import g4Shadow from '@/assets/zine/hte-g4-shadow.webp';
import g5Src from '@/assets/zine/hte-g5.webp';
import g5Shadow from '@/assets/zine/hte-g5-shadow.webp';
import g6Src from '@/assets/zine/hte-g6.webp';
import g6Shadow from '@/assets/zine/hte-g6-shadow.webp';
import g7Src from '@/assets/zine/hte-g7.webp';
import g7Shadow from '@/assets/zine/hte-g7-shadow.webp';
import g8Src from '@/assets/zine/hte-g8.webp';
import g8Shadow from '@/assets/zine/hte-g8-shadow.webp';
import type { StickerArt } from '@/story/art';

export const hteArt = {
  g1: { src: g1Src, shadow: g1Shadow, w: 861, h: 504, color: true },
  g2: { src: g2Src, shadow: g2Shadow, w: 601, h: 1035, color: true },
  g3: { src: g3Src, shadow: g3Shadow, w: 861, h: 504, color: true },
  g4: { src: g4Src, shadow: g4Shadow, w: 861, h: 587, color: true },
  g5: { src: g5Src, shadow: g5Shadow, w: 861, h: 587, color: true },
  g6: { src: g6Src, shadow: g6Shadow, w: 642, h: 840, color: true },
  g7: { src: g7Src, shadow: g7Shadow, w: 861, h: 503, color: true },
  g8: { src: g8Src, shadow: g8Shadow, w: 861, h: 587, color: true },
} satisfies Record<string, StickerArt>;
