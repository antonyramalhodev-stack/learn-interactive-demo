'use client';

import { useState, type ReactNode } from 'react';
import { SegmentedControl } from '@primer/react';
import { AlertIcon, LightBulbIcon, SmileyIcon, SparkleFillIcon } from '@primer/octicons-react';
import { basePath } from '../../lib/base-path';
import { mascot, type MascotMood } from '../../lib/mascot';
import styles from './mascot.module.css';

const placeholder = {
  idle: SmileyIcon,
  thinking: LightBulbIcon,
  cheer: SparkleFillIcon,
  oops: AlertIcon,
};

const iconSize = { small: 20, medium: 32, large: 48 };

export interface MascotProps {
  /** The mood picks the art and the animation. */
  mood?: MascotMood;
  size?: 'small' | 'medium' | 'large';
  /** The text in the speech bubble. Leave it out to show the figure alone. */
  children?: ReactNode;
  /** Put the bubble above the figure instead of beside it. */
  stacked?: boolean;
}

/**
 * The guide character. One component covers every place the character appears, so you set the
 * art once in `src/lib/mascot.ts` and each element picks it up.
 *
 * Each mood has its own motion: idle floats, thinking tilts, cheer jumps, and oops shakes.
 */
export function Mascot({ mood = 'idle', size = 'medium', children, stacked = false }: MascotProps) {
  const art = mascot.art[mood] || mascot.art.idle;
  const Icon = placeholder[mood];

  return (
    <div className={`learn-widget not-prose ${styles.mascot} ${styles[size]} ${stacked ? styles.stacked : ''}`}>
      {/* The key restarts the entrance animation each time the mood changes. */}
      <div key={mood} className={`${styles.figure} ${styles[`mood_${mood}`]}`} aria-hidden>
        {art ? (
          // The image is decoration. The speech bubble carries the message.
          <img className={styles.art} src={`${basePath}${art}`} alt="" />
        ) : (
          <span className={styles.placeholder}>
            <Icon size={iconSize[size]} />
          </span>
        )}
        {mood === 'cheer' ? (
          <span className={styles.burst}>
            {Array.from({ length: 6 }, (_, index) => (
              <i key={index} style={{ ['--angle' as string]: `${index * 60}deg` }} />
            ))}
          </span>
        ) : null}
      </div>
      {children ? (
        <div key={`${mood}-bubble`} className={styles.bubble}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

const moods: { mood: MascotMood; label: string; line: string }[] = [
  { mood: 'idle', label: 'Idle', line: 'Ready when you are.' },
  { mood: 'thinking', label: 'Thinking', line: 'Hint: start with git switch.' },
  { mood: 'cheer', label: 'Cheer', line: 'Nice work. That is correct.' },
  { mood: 'oops', label: 'Oops', line: 'Not quite. Give it another try.' },
];

/** A switch for the four moods, so you can check the art and the motion for each one. */
export function MascotPlayground() {
  const [index, setIndex] = useState(0);
  const current = moods[index];

  return (
    <div className={`learn-widget not-prose ${styles.playground}`}>
      <SegmentedControl aria-label="Mood" onChange={setIndex}>
        {moods.map((item, itemIndex) => (
          <SegmentedControl.Button key={item.mood} selected={itemIndex === index}>
            {item.label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
      <div className={styles.stage} aria-live="polite">
        <Mascot mood={current.mood} size="large">
          {current.line}
        </Mascot>
      </div>
    </div>
  );
}
