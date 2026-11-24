import { ClockIcon, MortarBoardIcon, RocketIcon } from '@primer/octicons-react';
import ui from './panel.module.css';
import styles from './lesson-meta.module.css';

export interface LessonMetaProps {
  duration: string;
  level: string;
  /** What the learner needs before they start. */
  requires?: string;
}

/**
 * Chips for the top of a lesson.
 *
 *   <LessonMeta duration="10 minutes" level="Beginner" requires="Git and a GitHub repository" />
 */
export function LessonMeta({ duration, level, requires }: LessonMetaProps) {
  return (
    <div className={`learn-element not-prose ${ui.root} ${styles.meta}`}>
      <span className={styles.chip}>
        <ClockIcon size={16} aria-hidden />
        {duration}
      </span>
      <span className={styles.chip}>
        <MortarBoardIcon size={16} aria-hidden />
        {level}
      </span>
      {requires ? (
        <span className={styles.chip}>
          <RocketIcon size={16} aria-hidden />
          {requires}
        </span>
      ) : null}
    </div>
  );
}
