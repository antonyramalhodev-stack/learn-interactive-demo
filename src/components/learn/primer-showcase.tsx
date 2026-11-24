'use client';

import { useId, useState } from 'react';
import {
  ActionList,
  ActionMenu,
  Button,
  IconButton,
  Label,
  ProgressBar,
  SegmentedControl,
  StateLabel,
  Timeline,
  ToggleSwitch,
} from '@primer/react';
import {
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  HeartIcon,
  StarIcon,
} from '@primer/octicons-react';
import styles from './learn.module.css';

const views = ['Preview', 'Code', 'Blame'];
const sortOptions = ['Newest', 'Oldest', 'Most commented'];

/** A small gallery of Primer React components. Every control here is live. */
export function PrimerShowcase() {
  const [view, setView] = useState(0);
  const [sort, setSort] = useState(0);
  const [stars, setStars] = useState(128);
  const [starred, setStarred] = useState(false);
  const [notify, setNotify] = useState(true);
  const toggleId = useId();

  return (
    <div className={`learn-widget not-prose ${styles.gallery}`}>
      <section className={styles.galleryItem}>
        <h3 className={styles.galleryTitle}>Button</h3>
        <div className={styles.row}>
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="invisible">Invisible</Button>
        </div>
        <div className={styles.row}>
          <Button
            leadingVisual={StarIcon}
            count={stars}
            aria-pressed={starred}
            onClick={() => {
              setStars((current) => current + (starred ? -1 : 1));
              setStarred((current) => !current);
            }}
          >
            {starred ? 'Starred' : 'Star'}
          </Button>
          <IconButton icon={HeartIcon} aria-label="Sponsor" />
        </div>
      </section>

      <section className={styles.galleryItem}>
        <h3 className={styles.galleryTitle}>Label and StateLabel</h3>
        <div className={styles.row}>
          <Label>Default</Label>
          <Label variant="accent">Beta</Label>
          <Label variant="success">Complete</Label>
          <Label variant="attention">In review</Label>
          <Label variant="danger">Deprecated</Label>
          <Label variant="done">Advanced</Label>
        </div>
        <div className={styles.row}>
          <StateLabel status="pullOpened" size="small">
            Open
          </StateLabel>
          <StateLabel status="pullMerged" size="small">
            Merged
          </StateLabel>
          <StateLabel status="draft" size="small">
            Draft
          </StateLabel>
        </div>
      </section>

      <section className={styles.galleryItem}>
        <h3 className={styles.galleryTitle}>SegmentedControl</h3>
        <SegmentedControl aria-label="File view" onChange={setView}>
          {views.map((name, index) => (
            <SegmentedControl.Button key={name} selected={view === index}>
              {name}
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>
        <span className={styles.muted}>Selected view: {views[view]}</span>
      </section>

      <section className={styles.galleryItem}>
        <h3 className={styles.galleryTitle}>ActionMenu</h3>
        <div className={styles.row}>
          <ActionMenu>
            <ActionMenu.Button>Sort: {sortOptions[sort]}</ActionMenu.Button>
            <ActionMenu.Overlay width="small">
              <ActionList selectionVariant="single">
                {sortOptions.map((name, index) => (
                  <ActionList.Item key={name} selected={sort === index} onSelect={() => setSort(index)}>
                    {name}
                  </ActionList.Item>
                ))}
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </div>
      </section>

      <section className={styles.galleryItem}>
        <h3 className={styles.galleryTitle}>ToggleSwitch</h3>
        <div className={styles.row}>
          <span id={toggleId}>Email me about new lessons</span>
          <ToggleSwitch
            aria-labelledby={toggleId}
            size="small"
            checked={notify}
            onClick={() => setNotify((current) => !current)}
          />
        </div>
        <span className={styles.muted}>Notifications: {notify ? 'enabled' : 'disabled'}</span>
      </section>

      <section className={styles.galleryItem}>
        <h3 className={styles.galleryTitle}>ProgressBar</h3>
        <ProgressBar aria-label="Course progress">
          <ProgressBar.Item progress={45} aria-label="Completed lessons" bg="success.emphasis" />
          <ProgressBar.Item progress={20} aria-label="Lessons in progress" bg="attention.emphasis" />
        </ProgressBar>
        <span className={styles.muted}>45% complete, 20% in progress</span>
      </section>

      <section className={styles.galleryItem} style={{ gridColumn: '1 / -1' }}>
        <h3 className={styles.galleryTitle}>Timeline</h3>
        <Timeline>
          <Timeline.Item>
            <Timeline.Badge>
              <GitCommitIcon aria-hidden />
            </Timeline.Badge>
            <Timeline.Body>You commit a change on a branch</Timeline.Body>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Badge variant="success">
              <GitPullRequestIcon aria-hidden />
            </Timeline.Badge>
            <Timeline.Body>You open a pull request</Timeline.Body>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Badge variant="done">
              <GitMergeIcon aria-hidden />
            </Timeline.Badge>
            <Timeline.Body>A maintainer merges the pull request</Timeline.Body>
          </Timeline.Item>
        </Timeline>
      </section>
    </div>
  );
}
