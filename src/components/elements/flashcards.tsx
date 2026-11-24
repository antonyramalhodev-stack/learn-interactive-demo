'use client';

import { Children, createContext, isValidElement, useContext, useState, type ReactNode } from 'react';
import { Button, CounterLabel, IconButton } from '@primer/react';
import { ChevronLeftIcon, ChevronRightIcon, StackIcon, SyncIcon } from '@primer/octicons-react';
import { Panel } from './panel';
import ui from './panel.module.css';
import styles from './flashcards.module.css';

const DeckContext = createContext<{ flipped: boolean; flip: () => void } | null>(null);

/**
 * A deck of flip cards.
 *
 *   <Flashcards>
 *     <Flashcard term="Branch">A separate line of work in a repository.</Flashcard>
 *     <Flashcard term="Commit">A saved snapshot of your changes.</Flashcard>
 *   </Flashcards>
 */
export function Flashcards({ children }: { children: ReactNode }) {
  const cards = Children.toArray(children).filter(isValidElement);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;

  const flip = () => setFlipped((value) => !value);
  const move = (step: number) => {
    setFlipped(false);
    setIndex((index + step + cards.length) % cards.length);
  };

  return (
    <Panel
      title="Flashcards"
      icon={<StackIcon size={16} aria-hidden />}
      actions={
        <CounterLabel>
          {index + 1} / {cards.length}
        </CounterLabel>
      }
    >
      <DeckContext.Provider value={{ flipped, flip }}>
        <div className={styles.stage}>{cards[index]}</div>
      </DeckContext.Provider>
      <div className={ui.row}>
        <IconButton icon={ChevronLeftIcon} aria-label="Previous card" onClick={() => move(-1)} />
        <Button leadingVisual={SyncIcon} onClick={flip}>
          Flip
        </Button>
        <IconButton icon={ChevronRightIcon} aria-label="Next card" onClick={() => move(1)} />
        <span className={ui.muted}>Select the card to flip it.</span>
      </div>
    </Panel>
  );
}

/** One card. The term is on the front, and the text between the tags is on the back. */
export function Flashcard({ term, children }: { term: string; children: ReactNode }) {
  const deck = useContext(DeckContext);
  if (!deck) throw new Error('<Flashcard> must be inside <Flashcards>.');

  return (
    <button
      type="button"
      className={`${styles.card} ${deck.flipped ? styles.flipped : ''}`}
      onClick={deck.flip}
      aria-label={deck.flipped ? 'Show the term' : 'Show the answer'}
    >
      <span className={styles.face} aria-hidden={deck.flipped}>
        <span className={styles.side}>Term</span>
        <span className={styles.text}>{term}</span>
      </span>
      <span className={`${styles.face} ${styles.back}`} aria-hidden={!deck.flipped}>
        <span className={styles.side}>Answer</span>
        <span className={styles.text}>{children}</span>
      </span>
    </button>
  );
}
