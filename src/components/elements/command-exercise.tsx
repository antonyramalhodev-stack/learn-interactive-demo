'use client';

import { useState, type FormEvent } from 'react';
import { Button, FormControl, TextInput } from '@primer/react';
import { LightBulbIcon, TerminalIcon } from '@primer/octicons-react';
import { Panel } from './panel';
import { scriptLines } from './script';
import ui from './panel.module.css';
import styles from './command-exercise.module.css';

export interface CommandExerciseProps {
  /** The task the learner completes. */
  prompt: string;
  hint?: string;
  placeholder?: string;
  /** The accepted commands, one on each line. */
  children: string;
}

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

/**
 * The learner types a command and the page checks it against the commands you accept.
 * Nothing runs, so it is safe on a static site.
 *
 *   <CommandExercise prompt="Create a branch named fix-typo and switch to it.">{`
 *   git switch -c fix-typo
 *   git checkout -b fix-typo
 *   `}</CommandExercise>
 */
export function CommandExercise({ prompt, hint, placeholder = 'Type the command', children }: CommandExerciseProps) {
  const accepted = scriptLines(children, 'CommandExercise').map(normalize);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(accepted.includes(normalize(value)) ? 'correct' : 'wrong');
  };

  return (
    <Panel title="Try it" icon={<TerminalIcon size={16} aria-hidden />}>
      <form className={styles.form} onSubmit={onSubmit}>
        <FormControl>
          <FormControl.Label>{prompt}</FormControl.Label>
          <TextInput
            block
            monospace
            leadingVisual="$"
            value={value}
            placeholder={placeholder}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            validationStatus={result === 'correct' ? 'success' : result === 'wrong' ? 'error' : undefined}
            onChange={(event) => {
              setValue(event.target.value);
              setResult('idle');
            }}
          />
          {result === 'correct' ? (
            <FormControl.Validation variant="success">Correct. That command does the job.</FormControl.Validation>
          ) : null}
          {result === 'wrong' ? (
            <FormControl.Validation variant="error">Not yet. Check the command and try again.</FormControl.Validation>
          ) : null}
        </FormControl>

        {showHint && hint ? (
          <p className={`${styles.hint} ${ui.pop}`}>
            <strong>Hint:</strong> {hint}
          </p>
        ) : null}

        <div className={ui.row}>
          <Button type="submit" variant="primary" disabled={value.trim() === ''}>
            Check
          </Button>
          {hint ? (
            <Button
              type="button"
              variant="invisible"
              leadingVisual={LightBulbIcon}
              onClick={() => setShowHint((current) => !current)}
            >
              {showHint ? 'Hide hint' : 'Show hint'}
            </Button>
          ) : null}
        </div>
      </form>
    </Panel>
  );
}
