export type MascotMood = 'idle' | 'thinking' | 'cheer' | 'oops';

/**
 * The guide character that the interactive elements use.
 *
 * To use your own art:
 * 1. Put one image for each mood in `public/mascot/`. SVG, PNG, WebP, and GIF all work.
 * 2. Set the paths below, for example `idle: '/mascot/idle.svg'`.
 *
 * A mood with no path shows a placeholder icon. Use only art you have the rights to use.
 */
export const mascot: { name: string; art: Record<MascotMood, string> } = {
  name: 'Guide',
  art: {
    idle: '',
    thinking: '',
    cheer: '',
    oops: '',
  },
};
