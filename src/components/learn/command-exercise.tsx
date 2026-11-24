'use client';

import { useState, type FormEvent } from 'react';
import { Button, FormControl, TextInput } from '@primer/react';
import { LightBulbIcon, TerminalIcon } from '@primer/octicons-react';
import { Mascot } from '../mascot/mascot';
import styles from './learn.module.css';

export interface CommandExerciseProps {
  /** The task the learner completes. */
  prompt: string;
  /** Every command the exercise accepts. Extra spaces do not matter. */
  answers: string[];
  hint?: string;
  placeholder?: string;
}

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

/**
 * A "type the command" exercise. It compares the learner's text with the accepted answers.
 * It does not run anything, so it is safe on a static site.
 */
export function CommandExercise({
  prompt,
  answers,
  hint,
  placeholder = 'Type the command',
}: CommandExerciseProps) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const accepted = answers.map(normalize);
    setResult(accepted.includes(normalize(value)) ? 'correct' : 'wrong');
  };

  return (
    <div className={`learn-widget not-prose ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <TerminalIcon size={16} aria-hidden />
        Try it
      </div>
      <form className={styles.panelBody} onSubmit={onSubmit}>
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
            <FormControl.Validation variant="success">
              Correct. That command does the job.
            </FormControl.Validation>
          ) : null}
          {result === 'wrong' ? (
            <FormControl.Validation variant="error">
              Not yet. Check the command and try again.
            </FormControl.Validation>
          ) : null}
        </FormControl>

        {showHint && hint ? (
          <Mascot size="small" mood="thinking">
            <strong>Hint:</strong> {hint}
          </Mascot>
        ) : null}

        <div className={styles.actions}>
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
    </div>
  );
}
