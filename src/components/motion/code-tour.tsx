'use client';

import { useEffect, useState } from 'react';
import { Button, IconButton } from '@primer/react';
import { ChevronLeftIcon, ChevronRightIcon, CodeIcon } from '@primer/octicons-react';
import { useInView, useReducedMotion } from './hooks';
import { Window } from './window';
import styles from './motion.module.css';

export interface CodeTourStep {
  /** One line number, or the first and last line of a range. Lines start at 1. */
  lines: number | [number, number];
  title: string;
  text: string;
}

export interface CodeTourProps {
  title?: string;
  code: string;
  steps: CodeTourStep[];
  /** Move through the steps on a timer until the reader takes over. */
  autoPlay?: boolean;
}

/**
 * A guided walk through a code sample.
 * A highlight slides to the lines for each step, and the note under the code explains them.
 */
export function CodeTour({ title = 'Code tour', code, steps, autoPlay = false }: CodeTourProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(autoPlay);

  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const id = window.setTimeout(() => setStep((value) => (value + 1) % steps.length), 2800);
    return () => window.clearTimeout(id);
  }, [auto, inView, reduced, step, steps.length]);

  const rows = code.replace(/\n$/, '').split('\n');
  const current = steps[step];
  const [from, to] = Array.isArray(current.lines) ? current.lines : [current.lines, current.lines];

  const go = (next: number) => {
    setAuto(false);
    setStep((next + steps.length) % steps.length);
  };

  return (
    <div ref={ref} className="learn-widget not-prose">
      <Window title={title} icon={<CodeIcon size={16} aria-hidden />} label={title}>
        <div className={styles.tourScroll}>
          <div className={styles.tourCode}>
            <span
              className={styles.tourBand}
              style={{
                transform: `translateY(calc(${from - 1} * var(--tour-line)))`,
                height: `calc(${to - from + 1} * var(--tour-line))`,
              }}
              aria-hidden
            />
            {rows.map((row, index) => {
              const number = index + 1;
              const focused = number >= from && number <= to;
              return (
                <div key={number} className={`${styles.tourLine} ${focused ? styles.tourLineOn : ''}`}>
                  <span className={styles.tourNumber}>{number}</span>
                  <span className={styles.tourText}>{row || ' '}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.tourNote} aria-live="polite">
          <div key={step} className={styles.swap}>
            <p className={styles.tourTitle}>{current.title}</p>
            <p className={styles.tourBody}>{current.text}</p>
          </div>
          <div className={styles.tourNav}>
            <IconButton icon={ChevronLeftIcon} aria-label="Previous step" size="small" onClick={() => go(step - 1)} />
            <span className={styles.tourCount}>
              {step + 1} / {steps.length}
            </span>
            {step === steps.length - 1 ? (
              <Button size="small" onClick={() => go(0)}>
                Start over
              </Button>
            ) : (
              <Button size="small" variant="primary" trailingVisual={ChevronRightIcon} onClick={() => go(step + 1)}>
                Next
              </Button>
            )}
          </div>
        </div>
      </Window>
    </div>
  );
}
