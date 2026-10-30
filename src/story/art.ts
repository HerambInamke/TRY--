/* Generated from the halftone sticker pipeline: tone images (grayscale + die-cut alpha), their soft shadows and sizes. */
import cloudASrc from '@/assets/zine/cloud-a.webp';
import cloudAShadow from '@/assets/zine/cloud-a-shadow.webp';
import cloudBSrc from '@/assets/zine/cloud-b.webp';
import cloudBShadow from '@/assets/zine/cloud-b-shadow.webp';
import cloudBigSrc from '@/assets/zine/cloud-big.webp';
import cloudBigShadow from '@/assets/zine/cloud-big-shadow.webp';
import doorLSrc from '@/assets/zine/door-l.webp';
import doorRSrc from '@/assets/zine/door-r.webp';
import fortSrc from '@/assets/zine/fort.webp';
import fortShadow from '@/assets/zine/fort-shadow.webp';
import printAcdSrc from '@/assets/zine/print-acd.webp';
import printAcdShadow from '@/assets/zine/print-acd-shadow.webp';
import printCrewSrc from '@/assets/zine/print-crew.webp';
import printCrewShadow from '@/assets/zine/print-crew-shadow.webp';
import printHallwaySrc from '@/assets/zine/print-hallway.webp';
import printHallwayShadow from '@/assets/zine/print-hallway-shadow.webp';
import printHteSrc from '@/assets/zine/print-hte.webp';
import printHteShadow from '@/assets/zine/print-hte-shadow.webp';
import printLabSrc from '@/assets/zine/print-lab.webp';
import printLabShadow from '@/assets/zine/print-lab-shadow.webp';
import printStageSrc from '@/assets/zine/print-stage.webp';
import printStageShadow from '@/assets/zine/print-stage-shadow.webp';

export type StickerArt = { src: string; shadow?: string; w: number; h: number };

export const art = {
  cloudA: { src: cloudASrc, shadow: cloudAShadow, w: 839, h: 570 },
  cloudB: { src: cloudBSrc, shadow: cloudBShadow, w: 838, h: 643 },
  cloudBig: { src: cloudBigSrc, shadow: cloudBigShadow, w: 1247, h: 859 },
  doorL: { src: doorLSrc, w: 78, h: 263 },
  doorR: { src: doorRSrc, w: 80, h: 263 },
  fort: { src: fortSrc, shadow: fortShadow, w: 1654, h: 834 },
  printAcd: { src: printAcdSrc, shadow: printAcdShadow, w: 840, h: 572 },
  printCrew: { src: printCrewSrc, shadow: printCrewShadow, w: 840, h: 414 },
  printHallway: { src: printHallwaySrc, shadow: printHallwayShadow, w: 840, h: 1107 },
  printHte: { src: printHteSrc, shadow: printHteShadow, w: 840, h: 1107 },
  printLab: { src: printLabSrc, shadow: printLabShadow, w: 840, h: 640 },
  printStage: { src: printStageSrc, shadow: printStageShadow, w: 840, h: 640 },
} satisfies Record<string, StickerArt>;

/** The doorway on the fort sticker, as fractions of the sticker; seam = where the two leaves meet. */
export const FORT_DOOR = { x: 0.4649, y: 0.5755, w: 0.0955, h: 0.3153, seam: 0.4937 };
