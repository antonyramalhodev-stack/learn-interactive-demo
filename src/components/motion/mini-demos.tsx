'use client';

import { CheckCircleFillIcon, CheckIcon, SearchIcon } from '@primer/octicons-react';
import { useInView, useLoopStep, useReducedMotion } from './hooks';
import styles from './motion.module.css';

/** Small looping figures for the element cards on the home page. They are decorative. */

function usePlay(count: number, delay: number) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const reduced = useReducedMotion();
  const step = useLoopStep(count, delay, inView && !reduced);
  return [ref, reduced ? count - 1 : step] as const;
}

const query = 'branch';
const results = ['Create a branch and open a pull request', 'Commit graph', 'Command exercise'];

export function MiniSearch() {
  // Steps: type the query one letter at a time, then walk down the results.
  const [ref, step] = usePlay(query.length + results.length + 3, 420);
  const typed = query.slice(0, Math.min(step, query.length));
  const selected = step - query.length - 1;

  return (
    <div ref={ref} className={styles.mini} aria-hidden>
      <div className={styles.miniSearch}>
        <SearchIcon size={16} />
        <span>{typed}</span>
        <span className={styles.caret} />
        <kbd>ESC</kbd>
      </div>
      <ul className={styles.miniResults}>
        {results.map((result, index) => (
          <li
            key={result}
            className={`${step > query.length ? styles.miniShow : ''} ${index === selected ? styles.miniPicked : ''}`}
          >
            {result}
          </li>
        ))}
      </ul>
    </div>
  );
}

const options = ['git branch -d docs', 'git switch -c docs', 'git push --delete docs'];

export function MiniQuiz() {
  const [ref, step] = usePlay(5, 900);

  return (
    <div ref={ref} className={styles.mini} aria-hidden>
      <ul className={styles.miniOptions}>
        {options.map((option, index) => {
          const picked = index === 1 && step >= 1;
          const correct = picked && step >= 2;
          return (
            <li key={option} className={`${picked ? styles.miniPicked : ''} ${correct ? styles.miniCorrect : ''}`}>
              <span className={styles.miniRadio} />
              <code>{option}</code>
              {correct ? <CheckCircleFillIcon size={16} /> : null}
            </li>
          );
        })}
      </ul>
      <p className={`${styles.miniNote} ${step >= 2 ? styles.miniShow : ''}`}>Correct</p>
    </div>
  );
}

export function MiniFlashcard() {
  const [ref, step] = usePlay(4, 1300);
  const flipped = step % 2 === 1;

  return (
    <div ref={ref} className={`${styles.mini} ${styles.miniFlipStage}`} aria-hidden>
      <div className={`${styles.miniFlip} ${flipped ? styles.miniFlipOn : ''}`}>
        <span className={styles.miniFace}>
          <small>Term</small>
          Pull request
        </span>
        <span className={`${styles.miniFace} ${styles.miniFaceBack}`}>
          <small>Answer</small>
          A proposal to merge changes
        </span>
      </div>
    </div>
  );
}

const tasks = ['Create a branch', 'Commit a change', 'Push the branch', 'Open a pull request'];

export function MiniProgress() {
  const [ref, step] = usePlay(tasks.length + 2, 800);
  const done = Math.min(step, tasks.length);

  return (
    <div ref={ref} className={styles.mini} aria-hidden>
      <div className={styles.miniBar}>
        <span style={{ width: `${(done / tasks.length) * 100}%` }} />
      </div>
      <ul className={styles.miniTasks}>
        {tasks.map((task, index) => (
          <li key={task} className={index < done ? styles.miniDone : ''}>
            <span className={styles.miniBox}>{index < done ? <CheckIcon size={12} /> : null}</span>
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}
