'use client';

import { useId, useState } from 'react';
import { Banner, Button, FormControl, Radio, RadioGroup } from '@primer/react';
import { ChecklistIcon } from '@primer/octicons-react';
import styles from './learn.module.css';

export interface QuizOption {
  label: string;
  /** Mark the right answer. */
  correct?: boolean;
  /** Text the learner sees after they check this option. */
  feedback?: string;
}

export interface QuizProps {
  question: string;
  options: QuizOption[];
}

/**
 * A single-choice knowledge check.
 * It runs in the browser only, so it works on a static host such as GitHub Pages.
 */
export function Quiz({ question, options }: QuizProps) {
  const name = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const choice = selected === null ? undefined : options[selected];
  const isCorrect = Boolean(choice?.correct);
  const locked = checked && isCorrect;

  return (
    <div className={`learn-widget not-prose ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <ChecklistIcon size={16} aria-hidden />
        Knowledge check
      </div>
      <div className={styles.panelBody}>
        <RadioGroup
          name={name}
          onChange={(value) => {
            setSelected(value === null ? null : Number(value));
            setChecked(false);
          }}
        >
          <RadioGroup.Label>{question}</RadioGroup.Label>
          {options.map((option, index) => (
            <FormControl key={option.label} disabled={locked}>
              <Radio value={String(index)} checked={selected === index} />
              <FormControl.Label>{option.label}</FormControl.Label>
            </FormControl>
          ))}
        </RadioGroup>

        {checked && choice ? (
          <div key={selected} className={styles.pop}>
            <Banner
              variant={isCorrect ? 'success' : 'critical'}
              title={isCorrect ? 'Correct' : 'Not quite'}
              description={choice.feedback}
            />
          </div>
        ) : null}

        <div className={styles.actions}>
          <Button
            variant="primary"
            disabled={selected === null || locked}
            onClick={() => setChecked(true)}
          >
            Check answer
          </Button>
          {checked ? (
            <Button
              variant="invisible"
              onClick={() => {
                setSelected(null);
                setChecked(false);
              }}
            >
              Reset
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
