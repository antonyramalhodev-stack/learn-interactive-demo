'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { CodeIcon } from '@primer/octicons-react';
import { useAutoStep } from './hooks';
import { Panel } from './panel';
import { StepNav } from './step-nav';
import ui from './panel.module.css';
import styles from './code-tour.module.css';

export interface StopProps {
  /** One line, or a range such as `3-6`. Lines start at 1. */
  lines: string;
  title: string;
  /** The note for this stop. */
  children: ReactNode;
}

/** One stop on a code tour. The tour reads its values, so the tag draws nothing by itself. */
export function Stop(_props: StopProps) {
  return null;
}

export interface CodeTourProps {
  title?: string;
  code: string;
  /** Move through the stops on a timer until the reader takes over. */
  autoPlay?: boolean;
  /** The `<Stop>` tags. */
  children: ReactNode;
}

/**
 * A guided walk through a code sample. A highlight slides to the lines for each stop.
 *
 *   <CodeTour title="deploy.yml" code={`on:
 *     push:
 *       branches: [main]`}>
 *     <Stop lines="1-3" title="The trigger">The workflow starts on every push to main.</Stop>
 *   </CodeTour>
 */
export function CodeTour({ title = 'Code tour', code, autoPlay = false, children }: CodeTourProps) {
  const stops = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => child.props as StopProps);
  const { ref, step, last, go, play } = useAutoStep(stops.length, { autoPlay, loop: true, delay: 2800 });

  const stop = stops[step];
  const [from, to = from] = stop.lines.split('-').map(Number);
  const rows = code.replace(/\n$/, '').split('\n');

  return (
    <Panel ref={ref} flush title={title} icon={<CodeIcon size={16} aria-hidden />}>
      <div className={styles.scroll}>
        <div className={styles.code}>
          <span
            className={styles.band}
            style={{
              transform: `translateY(calc(${from - 1} * var(--line)))`,
              height: `calc(${to - from + 1} * var(--line))`,
            }}
            aria-hidden
          />
          {rows.map((row, index) => {
            const number = index + 1;
            return (
              <div key={number} className={`${styles.row} ${number >= from && number <= to ? styles.focus : ''}`}>
                <span className={styles.number}>{number}</span>
                <span>{row || ' '}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.note} aria-live="polite">
        <div key={step} className={ui.pop}>
          <p className={styles.title}>{stop.title}</p>
          <div className={styles.text}>{stop.children}</div>
        </div>
        <div className={ui.row}>
          <StepNav step={step} last={last} onGo={go} onPlay={play} />
          <span className={ui.muted}>
            {step + 1} / {stops.length}
          </span>
        </div>
      </div>
    </Panel>
  );
}
