'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

const reducedQuery = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** True when the reader asks the system for less motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

/** Reports whether an element is on screen, so an animation plays only while the reader sees it. */
export function useInView<T extends Element>(threshold = 0.3): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/**
 * Steps from 0 to `count - 1` on a timer while the element is on screen.
 * The commit graph, the code tour, and the workflow run all use it.
 *
 * With reduced motion and `autoPlay`, it shows the last step and stops.
 */
export function useAutoStep(
  count: number,
  { delay = 1500, loop = false, autoPlay = true }: { delay?: number; loop?: boolean; autoPlay?: boolean } = {},
) {
  const [ref, inView] = useInView<HTMLElement>();
  const reduced = useReducedMotion();
  const last = count - 1;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    if (reduced && autoPlay) {
      setStep(last);
      setPlaying(false);
    }
  }, [autoPlay, last, reduced]);

  useEffect(() => {
    if (!playing || !inView || reduced) return;
    const atEnd = step >= last;
    if (atEnd && !loop) {
      setPlaying(false);
      return;
    }
    // At the end of a loop, hold the final state for a moment before the restart.
    const id = window.setTimeout(() => setStep(atEnd ? 0 : step + 1), atEnd ? delay * 2 : delay);
    return () => window.clearTimeout(id);
  }, [delay, inView, last, loop, playing, reduced, step]);

  /** Move to a step by hand. This stops the timer. */
  const go = (next: number) => {
    setPlaying(false);
    setStep(Math.min(Math.max(next, 0), last));
  };

  /** Play from the current step, or from the start when the last step is on screen. */
  const play = () => {
    if (step >= last) setStep(0);
    setPlaying(true);
  };

  return { ref, step, last, go, play };
}

/** Copies text and reports `copied` for a moment, so a button can show a check mark. */
export function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => {
        // Some embedded previews block the clipboard. The text stays visible to copy by hand.
      },
    );
  };

  return [copied, copy];
}

/** Keeps a value in the reader's browser. It still works when storage is blocked. */
export function useStored<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      // Storage can be blocked (private mode, embedded previews). The value then lasts for the visit.
    }
  }, [key]);

  const save = (next: T) => {
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Ignore: the element still works without storage.
    }
  };

  return [value, save];
}

function subscribeColorMode(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
  return () => observer.disconnect();
}

/** The Primer color mode on the page: `light` or `dark`. */
export function useColorMode(): string {
  return useSyncExternalStore(
    subscribeColorMode,
    () => document.documentElement.getAttribute('data-color-mode') ?? 'light',
    () => 'light',
  );
}
