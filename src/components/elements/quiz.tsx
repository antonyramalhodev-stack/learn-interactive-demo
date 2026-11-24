'use client';

import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { Banner, Button, Radio } from '@primer/react';
import { ChecklistIcon } from '@primer/octicons-react';
import { Panel } from './panel';
import ui from './panel.module.css';
import styles from './quiz.module.css';

interface QuizState {
  name: string;
  selected: string | null;
  checked: boolean;
  locked: boolean;
  select: (id: string, correct: boolean) => void;
}

const QuizContext = createContext<QuizState | null>(null);

/**
 * A single-choice knowledge check.
 *
 *   <Quiz question="Which command creates a branch?">
 *     <Answer correct feedback="The -c option creates the branch.">git switch -c docs</Answer>
 *     <Answer feedback="The -d option deletes a branch.">git branch -d docs</Answer>
 *   </Quiz>
 */
export function Quiz({ question, children }: { question: string; children: ReactNode }) {
  const name = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const [checked, setChecked] = useState(false);
  const locked = checked && correct;

  const select = (id: string, isCorrect: boolean) => {
    setSelected(id);
    setCorrect(isCorrect);
    setChecked(false);
  };

  return (
    <Panel title="Knowledge check" icon={<ChecklistIcon size={16} aria-hidden />}>
      <div role="radiogroup" aria-labelledby={`${name}-question`} className={styles.group}>
        <p id={`${name}-question`} className={styles.question}>
          {question}
        </p>
        <QuizContext.Provider value={{ name, selected, checked, locked, select }}>
          {children}
        </QuizContext.Provider>
      </div>
      <div className={ui.row}>
        <Button variant="primary" disabled={selected === null || locked} onClick={() => setChecked(true)}>
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
    </Panel>
  );
}

export interface AnswerProps {
  /** Mark the right answer. */
  correct?: boolean;
  /** Text the learner sees after they check this answer. */
  feedback?: string;
  children: ReactNode;
}

/** One answer in a quiz. The feedback shows under the answer after the learner checks it. */
export function Answer({ correct = false, feedback, children }: AnswerProps) {
  const quiz = useContext(QuizContext);
  const id = useId();
  if (!quiz) throw new Error('<Answer> must be inside <Quiz>.');
  const picked = quiz.selected === id;

  return (
    <div className={styles.answer}>
      <label className={styles.option}>
        <Radio
          name={quiz.name}
          value={id}
          checked={picked}
          disabled={quiz.locked}
          onChange={() => quiz.select(id, correct)}
        />
        <span className={styles.text}>{children}</span>
      </label>
      {picked && quiz.checked ? (
        <div className={ui.pop}>
          <Banner
            variant={correct ? 'success' : 'critical'}
            title={correct ? 'Correct' : 'Not quite'}
            description={feedback}
          />
        </div>
      ) : null}
    </div>
  );
}
