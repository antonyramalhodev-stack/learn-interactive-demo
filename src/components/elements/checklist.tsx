'use client';

import { Children, createContext, isValidElement, useContext, type ReactNode } from 'react';
import { Button, Checkbox, CheckboxGroup, FormControl, Label, ProgressBar } from '@primer/react';
import { TasklistIcon } from '@primer/octicons-react';
import { useStored } from './hooks';
import { Panel } from './panel';
import ui from './panel.module.css';

const TaskContext = createContext<{ checked: boolean; toggle: () => void } | null>(null);

export interface ChecklistProps {
  /** A unique key. The browser saves progress under this key. */
  id: string;
  title?: string;
  children: ReactNode;
}

/**
 * A checklist with a progress bar. Progress stays in the learner's own browser.
 *
 *   <Checklist id="first-pull-request" title="Lesson tasks">
 *     <Task>Create a branch</Task>
 *     <Task>Commit a change</Task>
 *   </Checklist>
 */
export function Checklist({ id, title = 'Track your progress', children }: ChecklistProps) {
  const tasks = Children.toArray(children).filter(isValidElement);
  // The saved value is the list of finished tasks, by position.
  const [saved, save] = useStored<number[]>(`learn-checklist:${id}`, []);
  const done = Array.isArray(saved) ? saved.filter((index) => index < tasks.length) : [];

  const percent = tasks.length === 0 ? 0 : Math.round((done.length / tasks.length) * 100);
  const complete = tasks.length > 0 && done.length === tasks.length;

  const toggle = (index: number) =>
    save(done.includes(index) ? done.filter((item) => item !== index) : [...done, index]);

  return (
    <Panel
      title="Progress"
      icon={<TasklistIcon size={16} aria-hidden />}
      actions={
        <>
          {complete ? (
            <span className={ui.pop}>
              <Label variant="success">Complete</Label>
            </span>
          ) : null}
          <span>
            {done.length} of {tasks.length} done
          </span>
        </>
      }
    >
      <ProgressBar progress={percent} aria-label={`${title}: ${percent}% complete`} />
      <CheckboxGroup>
        <CheckboxGroup.Label>{title}</CheckboxGroup.Label>
        {tasks.map((task, index) => (
          <TaskContext.Provider key={index} value={{ checked: done.includes(index), toggle: () => toggle(index) }}>
            {task}
          </TaskContext.Provider>
        ))}
      </CheckboxGroup>
      <div className={ui.row}>
        <Button variant="invisible" size="small" disabled={done.length === 0} onClick={() => save([])}>
          Reset progress
        </Button>
      </div>
    </Panel>
  );
}

/** One task in a checklist. */
export function Task({ children }: { children: ReactNode }) {
  const task = useContext(TaskContext);
  if (!task) throw new Error('<Task> must be inside <Checklist>.');

  return (
    <FormControl>
      <Checkbox checked={task.checked} onChange={task.toggle} />
      <FormControl.Label>{children}</FormControl.Label>
    </FormControl>
  );
}
