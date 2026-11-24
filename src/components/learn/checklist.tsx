'use client';

import { useEffect, useState } from 'react';
import { Button, Checkbox, CheckboxGroup, FormControl, Label, ProgressBar } from '@primer/react';
import { TasklistIcon } from '@primer/octicons-react';
import styles from './learn.module.css';

export interface ChecklistProps {
  /** A unique key. The browser saves progress under this key. */
  id: string;
  title?: string;
  items: string[];
}

const storageKey = (id: string) => `learn-checklist:${id}`;

function readSaved(id: string): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    // Storage can be blocked (private mode, embedded previews). Progress then lasts for the visit.
    return [];
  }
}

function save(id: string, done: string[]) {
  try {
    window.localStorage.setItem(storageKey(id), JSON.stringify(done));
  } catch {
    // Ignore: the checklist still works without storage.
  }
}

/**
 * A progress checklist. Each learner's progress stays in their own browser (localStorage),
 * so the site needs no server and no sign-in.
 */
export function Checklist({ id, title = 'Track your progress', items }: ChecklistProps) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    setDone(readSaved(id).filter((item) => items.includes(item)));
    // items is a static list from the MDX page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const update = (next: string[]) => {
    setDone(next);
    save(id, next);
  };

  const percent = items.length === 0 ? 0 : Math.round((done.length / items.length) * 100);
  const complete = items.length > 0 && done.length === items.length;

  return (
    <div className={`learn-widget not-prose ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <TasklistIcon size={16} aria-hidden />
        Progress
        <span className={styles.panelHeaderSpacer} />
        {complete ? <Label variant="success">Complete</Label> : null}
        <span>
          {done.length} of {items.length} done
        </span>
      </div>
      <div className={styles.panelBody}>
        <ProgressBar progress={percent} aria-label={`${title}: ${percent}% complete`} />
        <CheckboxGroup>
          <CheckboxGroup.Label>{title}</CheckboxGroup.Label>
          {items.map((item) => (
            <FormControl key={item}>
              <Checkbox
                value={item}
                checked={done.includes(item)}
                onChange={(event) =>
                  update(
                    event.target.checked
                      ? [...done, item]
                      : done.filter((current) => current !== item),
                  )
                }
              />
              <FormControl.Label>{item}</FormControl.Label>
            </FormControl>
          ))}
        </CheckboxGroup>
        <div className={styles.actions}>
          <Button variant="invisible" size="small" disabled={done.length === 0} onClick={() => update([])}>
            Reset progress
          </Button>
        </div>
      </div>
    </div>
  );
}
