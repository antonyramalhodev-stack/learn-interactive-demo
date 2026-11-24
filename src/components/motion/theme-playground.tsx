'use client';

import { useEffect, useState } from 'react';
import { Banner, Button, Label, ProgressBar, StateLabel } from '@primer/react';
import { MortarBoardIcon, PaintbrushIcon } from '@primer/octicons-react';
import { useInView, useReducedMotion } from './hooks';
import { Window } from './window';
import styles from './motion.module.css';

// The site loads light and dark for every page. These extra Primer themes load with this component.
import '@primer/primitives/dist/css/functional/themes/light-high-contrast.css';
import '@primer/primitives/dist/css/functional/themes/light-colorblind.css';
import '@primer/primitives/dist/css/functional/themes/dark-dimmed.css';
import '@primer/primitives/dist/css/functional/themes/dark-high-contrast.css';
import '@primer/primitives/dist/css/functional/themes/dark-colorblind.css';

interface Theme {
  /** The theme ID from @primer/primitives. */
  id: string;
  mode: 'light' | 'dark';
}

const themes: Theme[] = [
  { id: 'light', mode: 'light' },
  { id: 'light_high_contrast', mode: 'light' },
  { id: 'light_colorblind', mode: 'light' },
  { id: 'dark', mode: 'dark' },
  { id: 'dark_dimmed', mode: 'dark' },
  { id: 'dark_high_contrast', mode: 'dark' },
  { id: 'dark_colorblind', mode: 'dark' },
];

/** The attributes that tell Primer which theme to apply to an element and everything inside it. */
function themeProps(theme: Theme) {
  return {
    'data-color-mode': theme.mode,
    'data-light-theme': theme.mode === 'light' ? theme.id : 'light',
    'data-dark-theme': theme.mode === 'dark' ? theme.id : 'dark',
  };
}

export interface ThemePlaygroundProps {
  /** Step through the themes until the reader picks one. */
  autoPlay?: boolean;
  onStatus?: (text: string) => void;
}

/**
 * A live preview that switches between the Primer color themes.
 * Each theme is a set of CSS variables, so the same components change color with no other code.
 */
export function ThemePlayground({ autoPlay = true, onStatus }: ThemePlaygroundProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(3);
  const [auto, setAuto] = useState(autoPlay);

  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const id = window.setTimeout(() => setIndex((value) => (value + 1) % themes.length), 2400);
    return () => window.clearTimeout(id);
  }, [auto, index, inView, reduced]);

  const theme = themes[index];

  useEffect(() => {
    if (onStatus && inView) onStatus(`theme: ${theme.id}`);
  }, [inView, onStatus, theme.id]);

  return (
    <div ref={ref} className={`learn-widget not-prose ${styles.themeGrid}`}>
      <Window title={`theme: ${theme.id}`} icon={<PaintbrushIcon size={16} aria-hidden />} label="Theme preview">
        <div className={styles.themeStage} {...themeProps(theme)}>
          <div className={styles.themeHead}>
            <MortarBoardIcon size={20} aria-hidden />
            <strong>Open a pull request</strong>
            <span className={styles.spacer} />
            <Label variant="accent">Lesson 3</Label>
          </div>
          <p className={styles.themeText}>
            A pull request proposes your changes and starts a review. The colors on this card come
            from the selected theme.
          </p>
          <div className={styles.themeRow}>
            <StateLabel status="pullOpened" size="small">
              Open
            </StateLabel>
            <StateLabel status="pullMerged" size="small">
              Merged
            </StateLabel>
            <Label variant="success">Complete</Label>
            <Label variant="attention">In review</Label>
            <Label variant="danger">Blocked</Label>
          </div>
          <Banner
            variant="info"
            title="Tip"
            description="Keep a pull request small. Small changes get faster reviews."
          />
          <ProgressBar progress={66} aria-label="Lesson progress: 66%" />
          <div className={styles.themeRow}>
            <Button variant="primary">Continue</Button>
            <Button>Review the terms</Button>
          </div>
        </div>
      </Window>

      <fieldset className={styles.themeList}>
        <legend className={styles.themeLegend}>Pick a Primer theme</legend>
        {themes.map((item, itemIndex) => (
          <label
            key={item.id}
            className={`${styles.themeOption} ${itemIndex === index ? styles.themeOptionOn : ''}`}
          >
            <input
              type="radio"
              name="primer-theme"
              className={styles.srOnly}
              checked={itemIndex === index}
              onChange={() => {
                setAuto(false);
                setIndex(itemIndex);
              }}
            />
            <span className={styles.themeSwatch} {...themeProps(item)} aria-hidden>
              <i style={{ background: 'var(--fgColor-accent)' }} />
              <i style={{ background: 'var(--bgColor-success-emphasis)' }} />
              <i style={{ background: 'var(--fgColor-danger)' }} />
            </span>
            <code>{item.id}</code>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
