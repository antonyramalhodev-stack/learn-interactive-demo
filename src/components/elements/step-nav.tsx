'use client';

import { IconButton } from '@primer/react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, SyncIcon } from '@primer/octicons-react';

export interface StepNavProps {
  step: number;
  last: number;
  onGo: (step: number) => void;
  onPlay: () => void;
}

/** Previous, play, and next buttons. Any element that moves in steps can use them. */
export function StepNav({ step, last, onGo, onPlay }: StepNavProps) {
  const atEnd = step >= last;

  return (
    <>
      <IconButton
        icon={ChevronLeftIcon}
        aria-label="Previous step"
        size="small"
        variant="invisible"
        disabled={step === 0}
        onClick={() => onGo(step - 1)}
      />
      <IconButton
        icon={atEnd ? SyncIcon : PlayIcon}
        aria-label={atEnd ? 'Replay' : 'Play'}
        size="small"
        variant="invisible"
        onClick={onPlay}
      />
      <IconButton
        icon={ChevronRightIcon}
        aria-label="Next step"
        size="small"
        variant="invisible"
        disabled={atEnd}
        onClick={() => onGo(step + 1)}
      />
    </>
  );
}
