'use client';

import type { ReactNode } from 'react';
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
import ui from './panel.module.css';
import styles from './timeline.module.css';

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

/**
 * A sequence of events, built on the Primer Timeline component.
 * The events appear one after another when the reader scrolls to the timeline.
 *
 *   <Timeline>
 *     <Event icon="commit" title="You commit a change on a branch" />
 *     <Event icon="merge" color="done" title="A maintainer merges the pull request">
 *       Optional detail goes between the tags.
 *     </Event>
 *   </Timeline>
 */
export function Timeline({ children }: { children: ReactNode }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);

  return (
    <div ref={ref} className={`learn-element not-prose ${ui.root} ${styles.timeline} ${inView ? styles.on : ''}`}>
      <PrimerTimeline>{children}</PrimerTimeline>
    </div>
  );
}

export interface TimelineEventProps {
  title: string;
  /** The Octicon in the badge. */
  icon?: keyof typeof icons;
  /** The badge color, from Primer. */
  color?: 'accent' | 'success' | 'attention' | 'severe' | 'danger' | 'done';
  /** Optional detail under the title. */
  children?: ReactNode;
}

/** One event in a timeline. Lessons write it as `<Event>`. */
export function TimelineEvent({ title, icon = 'dot', color, children }: TimelineEventProps) {
  const Icon = icons[icon];

  return (
    <PrimerTimeline.Item className={styles.event}>
      <PrimerTimeline.Badge variant={color}>
        <Icon aria-hidden />
      </PrimerTimeline.Badge>
      <PrimerTimeline.Body>
        <span className={styles.title}>{title}</span>
        {children ? <div className={styles.detail}>{children}</div> : null}
      </PrimerTimeline.Body>
    </PrimerTimeline.Item>
  );
}
