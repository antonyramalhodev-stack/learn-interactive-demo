'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

const reducedQuery = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** True when the reader asks the system for less motion. Animations then jump to their end state. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

/** Reports whether an element is on screen, so an animation plays only while the reader can see it. */
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

/** Counts 0, 1, 2 and so on while `active`, then starts again. Small looping demos use it. */
export function useLoopStep(count: number, delay: number, active: boolean): number {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setStep((current) => (current + 1) % count), delay);
    return () => window.clearInterval(id);
  }, [active, count, delay]);

  return step;
}
