'use client';

import { useEffect, useState } from 'react';
import { Button, Spinner } from '@primer/react';
import {
  CheckCircleFillIcon,
  CircleIcon,
  GlobeIcon,
  SyncIcon,
  WorkflowIcon,
} from '@primer/octicons-react';
import { useInView, useReducedMotion } from './hooks';
import { Window } from './window';
import styles from './motion.module.css';

export interface WorkflowJob {
  name: string;
  steps: string[];
}

export interface WorkflowRunProps {
  title?: string;
  /** The event that starts the run, for example `git push origin main`. */
  trigger: string;
  jobs: WorkflowJob[];
  /** The line that appears when every job is done. */
  result: string;
}

/**
 * Plays back a workflow run: each job starts, ticks off its steps, and hands over to the next job.
 * It is an animation of the order of events. It does not read a real run.
 */
export function WorkflowRun({ title = 'Workflow run', trigger, jobs, result }: WorkflowRunProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const total = jobs.reduce((sum, job) => sum + job.steps.length, 0);
  // `tick` counts finished steps across all jobs. -1 means the run has not started.
  const [tick, setTick] = useState(-1);

  const finished = tick >= total;

  useEffect(() => {
    if (reduced) {
      setTick(total);
      return;
    }
    if (!inView || finished) return;
    const id = window.setTimeout(() => setTick((value) => value + 1), tick < 0 ? 900 : 850);
    return () => window.clearTimeout(id);
  }, [finished, inView, reduced, tick, total]);

  let offset = 0;
  const view = jobs.map((job) => {
    const start = offset;
    offset += job.steps.length;
    const doneSteps = Math.min(Math.max(tick - start, 0), job.steps.length);
    const state: 'queued' | 'running' | 'done' =
      tick < start || tick < 0 ? 'queued' : doneSteps >= job.steps.length ? 'done' : 'running';
    return { job, doneSteps, state };
  });

  return (
    <div ref={ref} className="learn-widget not-prose">
      <Window
        title={title}
        icon={<WorkflowIcon size={16} aria-hidden />}
        label={title}
        actions={
          <Button size="small" variant="invisible" leadingVisual={SyncIcon} onClick={() => setTick(-1)}>
            Re-run
          </Button>
        }
      >
        <div className={styles.flow}>
          <div className={styles.flowTrigger}>
            <span className={styles.prompt}>$</span>
            <code>{trigger}</code>
          </div>
          <ol className={styles.flowJobs}>
            {view.map(({ job, doneSteps, state }, index) => (
              <li key={job.name} className={`${styles.flowJob} ${styles[`flow_${state}`]}`}>
                {index > 0 ? <span className={styles.flowWire} aria-hidden /> : null}
                <div className={styles.flowCard}>
                  <div className={styles.flowHead}>
                    <span className={styles.flowState}>
                      {state === 'done' ? (
                        <CheckCircleFillIcon size={16} aria-label="Done" />
                      ) : state === 'running' ? (
                        <Spinner size="small" srText="Running" />
                      ) : (
                        <CircleIcon size={16} aria-label="Queued" />
                      )}
                    </span>
                    <span className={styles.flowName}>{job.name}</span>
                  </div>
                  <ul className={styles.flowSteps}>
                    {job.steps.map((name, stepIndex) => (
                      <li
                        key={name}
                        className={`${styles.flowStep} ${stepIndex < doneSteps ? styles.flowStepDone : ''} ${
                          state === 'running' && stepIndex === doneSteps ? styles.flowStepNow : ''
                        }`}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <p className={`${styles.flowResult} ${finished ? styles.flowResultOn : ''}`} aria-live="polite">
            <GlobeIcon size={16} aria-hidden />
            {finished ? result : 'Waiting for the jobs to finish'}
          </p>
        </div>
      </Window>
    </div>
  );
}
