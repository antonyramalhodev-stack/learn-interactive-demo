'use client';

import { useEffect, useState } from 'react';
import { Banner, IconButton } from '@primer/react';
import { CheckIcon, EyeIcon, FileIcon, SyncIcon } from '@primer/octicons-react';
import { Quiz } from '../learn/quiz';
import { useInView, useReducedMotion } from './hooks';
import { Window } from './window';
import styles from './motion.module.css';

const blocks = [
  {
    label: 'Front matter',
    source: `---
title: Open a pull request
description: Propose your changes for review.
---
`,
  },
  {
    label: 'Callout',
    source: `
<Callout title="Before you start">
  Push your branch to GitHub first.
</Callout>
`,
  },
  {
    label: 'Quiz',
    source: `
<Quiz
  question="Where do reviewers leave comments?"
  options={[
    { label: 'In the pull request', correct: true },
    { label: 'In the commit message' },
  ]}
/>
`,
  },
];

const full = blocks.map((block) => block.source).join('');
const ends = blocks.reduce<number[]>((list, block) => {
  list.push((list[list.length - 1] ?? 0) + block.source.length);
  return list;
}, []);

export interface TypedLessonProps {
  onStatus?: (text: string) => void;
}

/**
 * Types an MDX file on the left and renders each block on the right as soon as it is complete.
 * The quiz in the preview is the real component, so it works once it appears.
 */
export function TypedLesson({ onStatus }: TypedLessonProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const reduced = useReducedMotion();
  const [chars, setChars] = useState(0);

  const done = chars >= full.length;

  useEffect(() => {
    if (reduced) {
      setChars(full.length);
      return;
    }
    if (!inView || done) return;
    const atBlockEnd = ends.includes(chars);
    const id = window.setTimeout(() => setChars((value) => value + 1), atBlockEnd ? 520 : 16);
    return () => window.clearTimeout(id);
  }, [chars, done, inView, reduced]);

  const rendered = ends.filter((end) => chars >= end).length;
  const typing = Math.min(rendered, blocks.length - 1);

  useEffect(() => {
    if (!onStatus || !inView) return;
    onStatus(done ? `rendered ${blocks.length} blocks` : `typing lesson.mdx: ${blocks[typing].label.toLowerCase()}`);
  }, [done, inView, onStatus, typing]);

  return (
    <div ref={ref} className="learn-widget not-prose">
      <ol className={styles.rail} aria-label="Blocks in this file">
        {blocks.map((block, index) => {
          const state = index < rendered ? 'done' : index === typing && !done ? 'now' : 'next';
          return (
            <li key={block.label} className={`${styles.railItem} ${styles[`rail_${state}`]}`}>
              <span className={styles.railDot}>{state === 'done' ? <CheckIcon size={12} aria-hidden /> : null}</span>
              {block.label}
            </li>
          );
        })}
      </ol>
      <div className={styles.typedGrid}>
        <Window
          title="lesson.mdx"
          icon={<FileIcon size={16} aria-hidden />}
          label="Source file"
          actions={
            <IconButton icon={SyncIcon} aria-label="Replay" size="small" variant="invisible" onClick={() => setChars(0)} />
          }
        >
          <pre className={styles.typedSource} aria-label="MDX source">
            {full.slice(0, chars)}
            {done ? null : <span className={styles.caret} aria-hidden />}
          </pre>
        </Window>
        <Window title="Preview" icon={<EyeIcon size={16} aria-hidden />} label="Rendered lesson">
          <div className={styles.typedPreview}>
            {rendered >= 1 ? (
              <div className={styles.pop}>
                <h3 className={styles.typedTitle}>Open a pull request</h3>
                <p className={styles.typedLead}>Propose your changes for review.</p>
              </div>
            ) : (
              <div className={styles.skeleton} style={{ height: '3.2rem' }} />
            )}
            {rendered >= 2 ? (
              <div className={styles.pop}>
                <Banner variant="info" title="Before you start" description="Push your branch to GitHub first." />
              </div>
            ) : (
              <div className={styles.skeleton} style={{ height: '4.2rem' }} />
            )}
            {rendered >= 3 ? (
              <div className={styles.pop}>
                <Quiz
                  question="Where do reviewers leave comments?"
                  options={[
                    {
                      label: 'In the pull request',
                      correct: true,
                      feedback: 'Reviewers comment on the pull request, on a line or on the whole change.',
                    },
                    {
                      label: 'In the commit message',
                      feedback: 'The author writes the commit message. Review comments go on the pull request.',
                    },
                  ]}
                />
              </div>
            ) : (
              <div className={styles.skeleton} style={{ height: '11rem' }} />
            )}
          </div>
        </Window>
      </div>
    </div>
  );
}
