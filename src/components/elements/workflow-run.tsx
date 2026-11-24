'use client';

import { useMemo } from 'react';
import { Button, Spinner } from '@primer/react';
import { CheckCircleFillIcon, CircleIcon, GlobeIcon, SyncIcon, WorkflowIcon } from '@primer/octicons-react';
import { useAutoStep } from './hooks';
import { Panel } from './panel';
import { scriptLines } from './script';
import ui from './panel.module.css';
import styles from './workflow-run.module.css';

export interface WorkflowRunProps {
  title?: string;
  /** The event that starts the run, for example `git push origin main`. */
  trigger: string;
  /** The line that appears when every job is done. */
  result: string;
  /** The jobs, one on each line: `name: step, step, step`. */
  children: string;
}

/**
 * Plays back a workflow run: each job ticks off its steps and hands over to the next job.
 * It is an animation of the order of events. It does not read a real run.
 *
 *   <WorkflowRun trigger="git push origin main" result="The site is live">{`
 *   build: Install dependencies, Build the static site
 *   deploy: Deploy to GitHub Pages
 *   `}</WorkflowRun>
 */
export function WorkflowRun({ title = 'Workflow run', trigger, result, children }: WorkflowRunProps) {
  const jobs = useMemo(
    () =>
      scriptLines(children, 'WorkflowRun').map((line) => {
        const colon = line.indexOf(':');
        return {
          name: line.slice(0, colon).trim(),
          steps: line
            .slice(colon + 1)
            .split(',')
            .map((step) => step.trim()),
        };
      }),
    [children],
  );

  // `step` counts the finished steps across all jobs.
  const total = jobs.reduce((sum, job) => sum + job.steps.length, 0);
  const { ref, step, play } = useAutoStep(total + 1, { delay: 850 });
  const finished = step >= total;

  let before = 0;

  return (
    <Panel
      ref={ref}
      title={title}
      icon={<WorkflowIcon size={16} aria-hidden />}
      actions={
        <Button size="small" variant="invisible" leadingVisual={SyncIcon} onClick={play}>
          Re-run
        </Button>
      }
    >
      <div className={styles.trigger}>
        <span className={ui.prompt}>$</span>
        <code>{trigger}</code>
      </div>
      <ol className={styles.jobs}>
        {jobs.map((job, index) => {
          const doneSteps = Math.min(Math.max(step - before, 0), job.steps.length);
          const state = step < before ? 'queued' : doneSteps === job.steps.length ? 'done' : 'running';
          before += job.steps.length;

          return (
            <li key={job.name} className={`${styles.job} ${styles[state]}`}>
              {index > 0 ? <span className={styles.wire} aria-hidden /> : null}
              <div className={styles.card}>
                <div className={styles.head}>
                  {state === 'done' ? (
                    <CheckCircleFillIcon size={16} aria-label="Done" />
                  ) : state === 'running' ? (
                    <Spinner size="small" srText="Running" />
                  ) : (
                    <CircleIcon size={16} aria-label="Queued" />
                  )}
                  {job.name}
                </div>
                <ul className={styles.steps}>
                  {job.steps.map((name, stepIndex) => (
                    <li
                      key={name}
                      className={
                        stepIndex < doneSteps ? styles.stepDone : state === 'running' && stepIndex === doneSteps ? styles.stepNow : undefined
                      }
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
      <p className={`${styles.result} ${finished ? styles.resultOn : ''}`} aria-live="polite">
        <GlobeIcon size={16} aria-hidden />
        {finished ? result : 'Waiting for the jobs to finish'}
      </p>
    </Panel>
  );
}
