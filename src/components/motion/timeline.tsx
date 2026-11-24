'use client';

import { Timeline as PrimerTimeline } from '@primer/react';
import {
  CheckIcon,
  CodeReviewIcon,
  CommentIcon,
  DotFillIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  RocketIcon,
  TagIcon,
  WorkflowIcon,
} from '@primer/octicons-react';
import { useInView } from './hooks';
import styles from './motion.module.css';

const icons = {
  dot: DotFillIcon,
  commit: GitCommitIcon,
  branch: GitBranchIcon,
  'pull-request': GitPullRequestIcon,
  merge: GitMergeIcon,
  review: CodeReviewIcon,
  comment: CommentIcon,
  issue: IssueOpenedIcon,
  check: CheckIcon,
  workflow: WorkflowIcon,
  tag: TagIcon,
  rocket: RocketIcon,
};

export interface TimelineEvent {
  title: string;
  /** Optional detail under the title. */
  text?: string;
  /** The Octicon in the badge. */
  icon?: keyof typeof icons;
  /** The badge color, from Primer. */
  color?: 'accent' | 'success' | 'attention' | 'severe' | 'danger' | 'done';
}

export interface TimelineProps {
  events: TimelineEvent[];
}

/**
 * A sequence of events, built on the Primer Timeline component.
 * The events appear one after another when the reader scrolls to the timeline.
 */
export function Timeline({ events }: TimelineProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);

  return (
    <div ref={ref} className={`learn-widget not-prose ${styles.timeline} ${inView ? styles.timelineOn : ''}`}>
      <PrimerTimeline>
        {events.map((event, index) => {
          const Icon = icons[event.icon ?? 'dot'];
          return (
            <PrimerTimeline.Item
              key={`${index}-${event.title}`}
              className={styles.timelineItem}
              style={{ ['--timeline-index' as string]: index }}
            >
              <PrimerTimeline.Badge variant={event.color}>
                <Icon aria-hidden />
              </PrimerTimeline.Badge>
              <PrimerTimeline.Body>
                <span className={styles.timelineTitle}>{event.title}</span>
                {event.text ? <span className={styles.timelineText}>{event.text}</span> : null}
              </PrimerTimeline.Body>
            </PrimerTimeline.Item>
          );
        })}
      </PrimerTimeline>
    </div>
  );
}
