import { ClockIcon, MortarBoardIcon, RocketIcon } from '@primer/octicons-react';
import styles from './learn.module.css';

export interface LessonMetaProps {
  duration: string;
  level: string;
  /** What the learner needs before they start. */
  requires?: string;
}

/** A row of chips for the top of a lesson: time, level, and prerequisites. */
export function LessonMeta({ duration, level, requires }: LessonMetaProps) {
  return (
    <div className={`learn-widget not-prose ${styles.meta}`}>
      <span className={styles.metaItem}>
        <ClockIcon size={16} aria-hidden />
        {duration}
      </span>
      <span className={styles.metaItem}>
        <MortarBoardIcon size={16} aria-hidden />
        {level}
      </span>
      {requires ? (
        <span className={styles.metaItem}>
          <RocketIcon size={16} aria-hidden />
          {requires}
        </span>
      ) : null}
    </div>
  );
}
