'use client';

import { useState } from 'react';
import { Button, CounterLabel, IconButton } from '@primer/react';
import { ChevronLeftIcon, ChevronRightIcon, StackIcon, SyncIcon } from '@primer/octicons-react';
import styles from './learn.module.css';

export interface Flashcard {
  front: string;
  back: string;
}

/** A deck of flip cards for terms and definitions. */
export function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;
  const card = cards[index];

  const go = (step: number) => {
    setFlipped(false);
    setIndex((current) => (current + step + cards.length) % cards.length);
  };

  return (
    <div className={`learn-widget not-prose ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <StackIcon size={16} aria-hidden />
        Flashcards
        <span className={styles.panelHeaderSpacer} />
        <CounterLabel>
          {index + 1} / {cards.length}
        </CounterLabel>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.cardStage}>
          <button
            type="button"
            className={`${styles.card} ${flipped ? styles.cardFlipped : ''}`}
            onClick={() => setFlipped((value) => !value)}
            aria-label={flipped ? `Answer: ${card.back}. Select to see the term.` : `Term: ${card.front}. Select to see the answer.`}
          >
            <span className={styles.cardFace} aria-hidden={flipped}>
              <span className={styles.cardSide}>Term</span>
              <span className={styles.cardText}>{card.front}</span>
            </span>
            <span className={`${styles.cardFace} ${styles.cardBack}`} aria-hidden={!flipped}>
              <span className={styles.cardSide}>Answer</span>
              <span className={styles.cardText}>{card.back}</span>
            </span>
          </button>
        </div>
        <div className={styles.actions}>
          <IconButton icon={ChevronLeftIcon} aria-label="Previous card" onClick={() => go(-1)} />
          <Button leadingVisual={SyncIcon} onClick={() => setFlipped((value) => !value)}>
            Flip
          </Button>
          <IconButton icon={ChevronRightIcon} aria-label="Next card" onClick={() => go(1)} />
          <span className={styles.muted}>Select the card to flip it.</span>
        </div>
      </div>
    </div>
  );
}
